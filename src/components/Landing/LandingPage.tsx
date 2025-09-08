import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, MicIcon, BellIcon, FileTextIcon, BrainIcon, CloudIcon } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <SparklesIcon size={24} className="text-purple-600" />,
      title: 'AI-Powered Summarization',
      description: 'Automatically generate concise summaries of your notes using advanced AI technology.'
    },
    {
      icon: <MicIcon size={24} className="text-blue-600" />,
      title: 'Voice-to-Text',
      description: 'Speak your thoughts and have them instantly converted to text with high accuracy.'
    },
    {
      icon: <BellIcon size={24} className="text-green-600" />,
      title: 'Smart Reminders',
      description: 'Set intelligent reminders that understand your note content and remind you at the right time.'
    },
    {
      icon: <FileTextIcon size={24} className="text-indigo-600" />,
      title: 'Rich Note Editor',
      description: 'Create, edit, and organize your notes with a powerful and intuitive editor.'
    },
    {
      icon: <BrainIcon size={24} className="text-red-600" />,
      title: 'Smart Tags',
      description: 'AI automatically extracts relevant tags from your content for better organization.'
    },
    {
      icon: <CloudIcon size={24} className="text-teal-600" />,
      title: 'Cloud Sync',
      description: 'Access your notes from anywhere with secure cloud synchronization.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <SparklesIcon className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">AI Notes</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Take notes with</span>{' '}
                    <span className="block text-indigo-600 xl:inline">AI superpowers</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Transform your note-taking experience with AI-powered summarization, voice-to-text, 
                    and intelligent reminders. Never lose track of important information again.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link
                        to="/signup"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                      >
                        Start for free
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link
                        to="/login"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                      >
                        Sign In
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need for smarter notes
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Our AI-powered features help you capture, organize, and recall information more efficiently than ever before.
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <div key={index} className="relative">
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-white shadow-md">
                      {feature.icon}
                    </div>
                    <div className="ml-16">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-indigo-600">Create your account today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Get started for free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <div className="flex items-center">
              <SparklesIcon className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">AI Notes</span>
            </div>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2024 AI Notes. Empowering your thoughts with artificial intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;