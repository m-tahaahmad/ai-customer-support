import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';
import { getOpenAIEmbeddings } from '@/lib/langchain';

export async function GET(request: Request) {
    try {
        const faqPath = path.join(process.cwd(), 'data/faq.md');
        const rawData = fs.readFileSync(faqPath, 'utf8');

        const faqs = parseFAQs(rawData);
        console.log(`Parsed ${faqs.length} FAQs from file`);

        // Clear existing FAQs (optional - remove if you want to keep old data)
        const { error: deleteError } = await supabase
            .from('faqs')
            .delete()
            .neq('id', 0); // Delete all rows

        if (deleteError) {
            console.warn('Error clearing existing FAQs:', deleteError);
        }

        // Process each FAQ
        const embeddings = getOpenAIEmbeddings();
        for (const faq of faqs) {
            // Create embedding for the combined question + answer
            // Use the same model as the chat route
            const textToEmbed = `${faq.question} ${faq.answer}`;

            const embedding = await embeddings.embedQuery(textToEmbed);

            // Insert into Supabase
            const { data, error } = await supabase
                .from('faqs')
                .insert([{
                    question: faq.question,
                    answer: faq.answer,
                    embedding
                }]);

            if (error) {
                console.error('Error inserting FAQ:', error);
            } else {
                console.log('✓ Inserted:', faq.question);
            }
        }

        return NextResponse.json({
            message: `Successfully ingested ${faqs.length} FAQs`,
            success: true,
            count: faqs.length
        });
    } catch (error) {
        console.error('Error in ingest route:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error', success: false },
            { status: 500 }
        );
    }
}

interface FAQ {
    question: string;
    answer: string;
}

function parseFAQs(md: string): FAQ[] {
    const faqs: FAQ[] = [];
    const lines = md.split('\n');
    let q = '', a = '';
    for (const line of lines) {
        if (line.startsWith('Q:')) {
            q = line.replace('Q:', '').trim();
        } else if (line.startsWith('A:')) {
            a = line.replace('A:', '').trim();
            if (q && a) {
                faqs.push({ question: q, answer: a });
                q = ''; a = '';
            }
        }
    }
    return faqs;
}