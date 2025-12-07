import { X } from "lucide-react";
import { useState } from "react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
  };
  onSave: (updatedUser: {
    name: string;
    title: string;
    bio: string;
  }) => void;
}

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
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
        <div className="relative w-full max-w-lg transform rounded-2xl bg-popover p-8 text-left shadow-2xl transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-popover-foreground">Edit Profile</h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Photo Upload */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-muted overflow-hidden border border-border">
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-medical-600 hover:text-medical-700 bg-medical-50 px-4 py-2 rounded-lg border border-medical-100"
              >
                Change Photo
              </button>
            </div>

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
