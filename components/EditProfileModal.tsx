import { X, Linkedin, Github, Instagram, Send, Upload, User as UserIcon } from "lucide-react";
import { useState, useRef } from "react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    linkedin: string;
    github: string;
    instagram: string;
    telegram: string;
  };
  onSave: (updatedUser: {
    name: string;
    title: string;
    bio: string;
    linkedin: string;
    github: string;
    instagram: string;
    telegram: string;
    avatar: string;
  }) => void;
}

const AVATAR_SEEDS = [
  "House", "Wilson", "Cuddy", "Foreman", "Chase", 
  "Cameron", "Thirteen", "Taub", "Kutner", "Masters", 
  "Adams", "Park", "Vogler", "Tritter", "Amber", 
  "Stacy", "Lucas", "Dominika", "Martha", "Jessica"
];

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onSave,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    title: user.title,
    bio: user.bio,
    linkedin: user.linkedin,
    github: user.github,
    instagram: user.instagram,
    telegram: user.telegram,
    avatar: user.avatar,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateUrls = () => {
    const newErrors: { [key: string]: string } = {};
    const { linkedin, github, instagram, telegram } = formData;

    if (linkedin && !linkedin.match(/^https:\/\/(www\.)?linkedin\.com\/.*$/)) {
      newErrors.linkedin = "Must be a valid LinkedIn URL (https://linkedin.com/...)";
    }
    if (github && !github.match(/^https:\/\/(www\.)?github\.com\/.*$/)) {
      newErrors.github = "Must be a valid GitHub URL (https://github.com/...)";
    }
    if (instagram && !instagram.match(/^https:\/\/(www\.)?instagram\.com\/.*$/)) {
      newErrors.instagram = "Must be a valid Instagram URL (https://instagram.com/...)";
    }
    if (telegram && !telegram.match(/^https:\/\/(t\.me|telegram\.me)\/.*$/)) {
      newErrors.telegram = "Must be a valid Telegram URL (https://t.me/...)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrls()) return;
    onSave(formData);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
        setShowAvatarSelection(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform rounded-2xl bg-popover p-8 text-left shadow-2xl transition-all max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-popover-foreground">Edit Profile</h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Photo Upload */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted overflow-hidden border border-border">
                  <img
                    src={formData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowAvatarSelection(!showAvatarSelection)}
                  className="text-sm font-semibold text-medical-600 hover:text-medical-700 bg-medical-50 px-4 py-2 rounded-lg border border-medical-100"
                >
                  Change Photo
                </button>
              </div>

              {showAvatarSelection && (
                <div className="p-4 bg-muted/50 rounded-xl border border-border animate-fade-in">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-foreground">Choose an avatar or upload</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs flex items-center gap-1 text-medical-600 hover:text-medical-700 font-semibold"
                    >
                      <Upload className="w-3 h-3" /> Upload from PC
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {AVATAR_SEEDS.map((seed) => (
                      <button
                        key={seed}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}` });
                          setShowAvatarSelection(false);
                        }}
                        className="aspect-square rounded-full overflow-hidden border border-border hover:border-medical-500 hover:scale-110 transition-all bg-background"
                        title={seed}
                      >
                        <img
                          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`}
                          alt={seed}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Bio (Sarcasm encouraged)
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-sm text-foreground bg-background"
              />
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-bold text-foreground mb-4">Social Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      placeholder="LinkedIn URL"
                      value={formData.linkedin}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.linkedin ? "border-red-500" : "border-input"} focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground text-sm`}
                    />
                  </div>
                  {errors.linkedin && <p className="text-xs text-red-500 mt-1">{errors.linkedin}</p>}
                </div>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Github className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      placeholder="GitHub URL"
                      value={formData.github}
                      onChange={(e) =>
                        setFormData({ ...formData, github: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.github ? "border-red-500" : "border-input"} focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground text-sm`}
                    />
                  </div>
                  {errors.github && <p className="text-xs text-red-500 mt-1">{errors.github}</p>}
                </div>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Instagram className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      placeholder="Instagram URL"
                      value={formData.instagram}
                      onChange={(e) =>
                        setFormData({ ...formData, instagram: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.instagram ? "border-red-500" : "border-input"} focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground text-sm`}
                    />
                  </div>
                  {errors.instagram && <p className="text-xs text-red-500 mt-1">{errors.instagram}</p>}
                </div>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Send className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      placeholder="Telegram URL"
                      value={formData.telegram}
                      onChange={(e) =>
                        setFormData({ ...formData, telegram: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.telegram ? "border-red-500" : "border-input"} focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground text-sm`}
                    />
                  </div>
                  {errors.telegram && <p className="text-xs text-red-500 mt-1">{errors.telegram}</p>}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
