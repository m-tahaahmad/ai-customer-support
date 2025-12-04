import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getOpenAIChatModel, getOpenAIEmbeddings } from '@/lib/langchain';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

/**
 * API route for chat functionality
 * This is a placeholder for future backend integration
 * Currently returns a mock response
 */
export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    const embeddings = getOpenAIEmbeddings();
    const embedding = await embeddings.embedQuery(question);

    const { data: faqs, error: rpcError } = await supabase.rpc('match_faqs', {
      query_embedding: embedding,
      match_count: 3
    });

    if (rpcError) {
      console.error('Error fetching FAQs:', rpcError);
      // Fallback: try direct query if RPC doesn't exist
      console.log('Attempting fallback query...');
      const { data: allFaqs } = await supabase
        .from('faqs')
        .select('question, answer')
        .limit(3);

      if (allFaqs && allFaqs.length > 0) {
        const context = allFaqs.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
        const llm = getOpenAIChatModel();
        const response = await llm.invoke([
          new SystemMessage("You are a helpful customer support assistant. Answer questions based on the provided FAQ information."),
          new HumanMessage(`FAQ Information:\n${context}\n\nCustomer Question: ${question}`)
        ]);
        return NextResponse.json({
          message: response.content,
          success: true,
        });
      }
    }

    if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
      console.warn('No FAQs found for query');
      return NextResponse.json({
        message: "I couldn't find relevant information in our FAQ database. Please try rephrasing your question or contact support directly.",
        success: true,
      });
    }

    const context = faqs
      .map((f: any) => `Q: ${f.question}\nA: ${f.answer}`)
      .join('\n\n');

    const llm = getOpenAIChatModel();
    const response = await llm.invoke([
      new SystemMessage("You are a helpful customer support assistant. Answer questions based ONLY on the provided FAQ information. If the answer is not in the FAQs, politely say you don't have that information and suggest contacting support."),
      new HumanMessage(`FAQ Information:\n${context}\n\nCustomer Question: ${question}`)
    ]);

    return NextResponse.json({
      message: response.content,
      success: true,
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: error, success: false },
      { status: 500 }
    );
  }
}

