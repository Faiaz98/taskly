import { useState } from 'react';
import { CheckSquare, Link2, Copy, Check, Users } from 'lucide-react';

interface WorkspaceHeaderProps {
  workspaceName: string;
  inviteLink: string;
}

export function WorkspaceHeader({ workspaceName, inviteLink }: WorkspaceHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mb-10 text-center animate-fade-in">
      <div className="inline-flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <CheckSquare className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="text-left">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent tracking-tight">
            Family Tasks
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Users className="w-3.5 h-3.5 text-gray-500" />
            <p className="text-xs text-gray-500 font-medium">
              Workspace: <span className="text-gray-700 font-semibold">{workspaceName}</span>
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 max-w-2xl mx-auto text-[15px] leading-relaxed font-medium mb-4">
        Collaborate with your family in real-time. Track tasks, share progress, and stay organized together.
      </p>

      {/* Invite Link Section */}
      <div className="max-w-md mx-auto mt-6">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
          <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="flex-1 text-xs text-gray-600 bg-transparent focus:outline-none font-mono truncate"
          />
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              copied
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Share this link with family members to invite them to your workspace
        </p>
      </div>
    </div>
  );
}
