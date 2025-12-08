import { Camera, MapPin, Calendar, ShieldCheck, Linkedin, Github, Instagram, Send } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    name: string;
    title: string;
    location: string;
    avatar: string;
    level: number;
    xp: number;
    maxXp: number;
    rank: string;
    joinedAt: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    telegram?: string;
  };
  onEdit: () => void;
}

export default function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  const xpPercentage = Math.min(100, Math.max(0, (user.xp / user.maxXp) * 100));

  return (
    <div className="relative bg-card rounded-3xl border border-border shadow-sm overflow-hidden mb-8 animate-fade-in">
      {/* Cover Photo */}
      <div className="h-32 sm:h-48 bg-profile-cover" />

      <div className="px-6 sm:px-10 pb-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-end -mt-12 sm:-mt-16 gap-6">
          {/* Profile Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left w-full sm:w-auto">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full border-4 border-background shadow-md overflow-hidden bg-muted flex-shrink-0 relative group">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {/* Edit Overlay */}
              <div
                onClick={onEdit}
                className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Text Info */}
            <div className="mb-2 flex-grow">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" /> {user.rank}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{user.title}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {user.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Joined {user.joinedAt}
                </span>
              </div>

              {/* Socials */}
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                {user.linkedin && (
                  <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-muted hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 text-muted-foreground transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {user.github && (
                  <a href={user.github} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-muted hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 text-muted-foreground transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {user.instagram && (
                  <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-muted hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/30 dark:hover:text-pink-400 text-muted-foreground transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {user.telegram && (
                  <a href={user.telegram} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-muted hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-900/30 dark:hover:text-sky-400 text-muted-foreground transition-colors">
                    <Send className="w-4 h-4" />
                  </a>
                )}
                {!user.linkedin && !user.github && !user.instagram && !user.telegram && (
                   <span className="text-xs text-muted-foreground italic">Add socials via Edit Profile</span>
                )}
              </div>
            </div>
          </div>

          {/* Level & Action */}
          <div className="flex flex-col items-center sm:items-end gap-4 w-full sm:w-auto mb-2">
            <div className="flex flex-col items-end gap-2 w-full sm:w-64">
              <div className="flex justify-between w-full text-xs font-bold">
                <span className="text-muted-foreground uppercase">Level {user.level}</span>
                <span className="text-medical-600">{Math.floor(xpPercentage)}%</span>
              </div>
              <div className="w-full h-2.5 bg-secondary-foreground/50 rounded-full overflow-hidden border border-border">
                <div 
                  className="h-full bg-gradient-to-r from-medical-500 to-medical-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {user.xp.toLocaleString()} / {user.maxXp.toLocaleString()} XP to Level {user.level + 1}
              </span>
            </div>
            
            <button
              onClick={onEdit}
              className="px-5 py-2 bg-background border border-input hover:border-medical-500 hover:text-medical-600 text-foreground font-semibold rounded-xl text-sm transition-all shadow-sm w-full sm:w-auto"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
