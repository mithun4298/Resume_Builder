export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          <span className="font-bold text-lg tracking-tight">ResumeAI</span>
          <span className="text-xs bg-white/20 rounded px-2 py-0.5 ml-2">by mithun4298</span>
        </div>
        <div className="text-sm opacity-80">
          © {new Date().getFullYear()} ResumeAI. All rights reserved.
        </div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="https://github.com/mithun4298" target="_blank" rel="noopener noreferrer" className="hover:underline opacity-90">GitHub</a>
          <a href="mailto:support@resumeai.com" className="hover:underline opacity-90">Contact</a>
        </div>
      </div>
    </footer>
  );
}
