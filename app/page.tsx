import Logo from '@/components/Logo';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 h-[calc(100vh-12rem)] flex flex-col p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              How can I help you today?
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ask me anything about our products or services
            </p>
          </div>
          
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
