import { Camera, MapPin } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    name: string;
    title: string;
    location: string;
    avatar: string;
    level: number;
    xp: number;
    maxXp: number;
  };
  onEdit: () => void;
}

export default function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  return (
    <div className="relative bg-card rounded-3xl border border-border shadow-sm overflow-hidden mb-8 animate-fade-in">
      {/* Cover Photo / Gradient */}
      <div className="h-32 sm:h-48 bg-gradient-to-r from-medical-600 to-indigo-600"></div>

      <div className="px-6 sm:px-10 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-end -mt-12 sm:-mt-16 gap-6">
          {/* Profile Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
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
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="text-muted-foreground font-medium">{user.title}</span>
                <span className="hidden sm:inline text-muted-foreground/30">•</span>
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {user.location}
                </span>
              </div>
            </div>
          </div>

          {/* Level & Action */}
          <div className="flex flex-col items-center sm:items-end gap-4 w-full sm:w-auto mb-2">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="block text-xs font-bold text-muted-foreground uppercase">
                  Level {user.level}
                </span>
                <span className="block text-xs text-medical-600 font-bold">
                  {user.xp.toLocaleString()} / {user.maxXp.toLocaleString()} XP
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold border-4 border-background shadow-sm ring-2 ring-medical-500">
                {user.level}
              </div>
            </div>
            <button
              onClick={onEdit}
              className="px-5 py-2 bg-background border border-input hover:border-medical-500 hover:text-medical-600 text-foreground font-semibold rounded-xl text-sm transition-all shadow-sm"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
