import { useState, useEffect, useReducer } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  BookOpen,
  Heart,
  Sparkles,
  Target,
  Award,
  Save,
  Plus,
  X,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Input, Textarea } from "./ui/Input";
import { Button, IconButton } from "./ui/Button";

interface ProfileData {
  isPublished: boolean;
  bio: string;
  favoriteGenres: string[];
  favoriteAuthors: string[];
  whyIRead: string;
  funFacts: string[];
  currentlyReading: string;
  readingGoals: string[];
  achievements: string[];
  heroTagline: string;
  heroDescription: string;
}

// Pre-populated with Izzy's existing content as a starting point
const defaultProfile: ProfileData = {
  isPublished: true,
  bio: "Hi! I'm Izzy, and I absolutely LOVE reading! Books take me on amazing adventures to magical worlds, help me meet incredible characters, and teach me new things every day. Reading is my superpower!",
  favoriteGenres: ["Fantasy", "Adventure", "Mystery", "Realistic Fiction"],
  favoriteAuthors: [
    "J.K. Rowling",
    "R.J. Palacio",
    "Roald Dahl",
    "Rick Riordan",
  ],
  whyIRead:
    "I read because every book is a new adventure! Reading helps me imagine amazing worlds, understand different people, and learn about things I've never experienced. Plus, it's really fun!",
  funFacts: [
    "I can finish a 300-page book in one weekend!",
    "My favorite reading spot is curled up on the couch with my dog",
    "I've read the entire Harry Potter series 3 times",
    "I love recommending books to my friends",
  ],
  currentlyReading: "Percy Jackson & The Lightning Thief by Rick Riordan",
  readingGoals: [
    "Read 50 books this year",
    "Try a new genre every month",
    "Start a book club with my friends",
    "Write reviews for every book I read",
  ],
  achievements: [
    "Read 100 books",
    "Finished a series in one week",
    "Poetry Contest Winner",
    "Book Club Leader",
    "500 Pages in One Day",
  ],
  heroTagline: "Welcome to my bookshelf!",
  heroDescription:
    "Here you'll find my reviews, poems, and all my bookish adventures.",
};

const ProfileEditor: React.FC = () => {
  const { convexUserId } = useAuth();
  const existingProfile = useQuery(
    api.aboutProfile.getByUser,
    convexUserId ? { userId: convexUserId } : "skip",
  );
  const upsertProfile = useMutation(api.aboutProfile.upsert);

  type ProfileAction =
    | { type: "LOAD"; data: typeof existingProfile }
    | { type: "UPDATE"; field: keyof ProfileData; value: string | boolean | string[] }
    | { type: "ADD_ITEM"; field: keyof ProfileData; value: string }
    | { type: "REMOVE_ITEM"; field: keyof ProfileData; index: number }
    | { type: "RESET" };

  function profileReducer(state: ProfileData, action: ProfileAction): ProfileData {
    switch (action.type) {
      case "LOAD":
        if (!action.data) return defaultProfile;
        return {
          isPublished: action.data.isPublished,
          bio: action.data.bio,
          favoriteGenres: action.data.favoriteGenres,
          favoriteAuthors: action.data.favoriteAuthors,
          whyIRead: action.data.whyIRead,
          funFacts: action.data.funFacts,
          currentlyReading: action.data.currentlyReading || "",
          readingGoals: action.data.readingGoals,
          achievements: action.data.achievements,
          heroTagline: action.data.heroTagline || "",
          heroDescription: action.data.heroDescription || "",
        };
      case "UPDATE":
        return { ...state, [action.field]: action.value };
      case "ADD_ITEM": {
        const list = state[action.field] as string[];
        if (list.includes(action.value)) return state;
        return { ...state, [action.field]: [...list, action.value] };
      }
      case "REMOVE_ITEM": {
        const list = state[action.field] as string[];
        return { ...state, [action.field]: list.filter((_, i) => i !== action.index) };
      }
      case "RESET":
        return defaultProfile;
      default:
        return state;
    }
  }

  const [profile, dispatch] = useReducer(profileReducer, defaultProfile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newItem, setNewItem] = useState<{ [key: string]: string }>({});

  // Load existing profile
  useEffect(() => {
    if (existingProfile) {
      dispatch({ type: "LOAD", data: existingProfile });
    }
  }, [existingProfile]);

  const handleSave = async () => {
    if (!convexUserId) return;

    setSaving(true);
    try {
      await upsertProfile({
        ...profile,
        currentlyReading: profile.currentlyReading || undefined,
        heroTagline: profile.heroTagline || undefined,
        heroDescription: profile.heroDescription || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const addToList = (field: keyof ProfileData) => {
    const value = newItem[field]?.trim();
    if (!value) return;

    const currentList = profile[field] as string[];
    if (!currentList.includes(value)) {
      dispatch({ type: "ADD_ITEM", field, value });
    }
    setNewItem({ ...newItem, [field]: "" });
  };

  const removeFromList = (field: keyof ProfileData, index: number) => {
    dispatch({ type: "REMOVE_ITEM", field, index });
  };

  const isLoading = convexUserId && existingProfile === undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <User className="w-8 h-8" />
              Edit My Profile
            </h1>
            <p className="text-white/90 mt-1">
              Customize your About Me page and public profile
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                dispatch({ type: "UPDATE", field: "isPublished", value: !profile.isPublished })
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                profile.isPublished
                  ? "bg-white text-purple-600"
                  : "bg-white/20 text-white"
              }`}
            >
              {profile.isPublished ? (
                <>
                  <Eye className="w-4 h-4" /> Published
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" /> Hidden
                </>
              )}
            </button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
              icon={saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            >
              {saved ? "Saved!" : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <Section
        title="Hero Section"
        icon={Sparkles}
        color="purple"
        description="Customize what visitors see first on your portfolio"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Tagline (shown on homepage)
            </label>
            <Input
              type="text"
              value={profile.heroTagline}
              onChange={(e) =>
                dispatch({ type: "UPDATE", field: "heroTagline", value: e.target.value })
              }
              placeholder="e.g., Welcome to my bookshelf!"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Short Description
            </label>
            <Textarea
              value={profile.heroDescription}
              onChange={(e) =>
                dispatch({ type: "UPDATE", field: "heroDescription", value: e.target.value })
              }
              placeholder="A brief intro about you and your love of reading..."
              rows={2}
            />
          </div>
        </div>
      </Section>

      {/* Bio */}
      <Section
        title="About Me"
        icon={User}
        color="blue"
        description="Tell visitors about yourself"
      >
        <Textarea
          value={profile.bio}
          onChange={(e) => dispatch({ type: "UPDATE", field: "bio", value: e.target.value })}
          placeholder="Hi! I'm Izzy, and I absolutely LOVE reading..."
          rows={4}
        />
      </Section>

      {/* Currently Reading */}
      <Section
        title="Currently Reading"
        icon={BookOpen}
        color="green"
        description="What book are you reading right now?"
      >
        <Input
          type="text"
          value={profile.currentlyReading}
          onChange={(e) =>
            dispatch({ type: "UPDATE", field: "currentlyReading", value: e.target.value })
          }
          placeholder="e.g., Percy Jackson & The Lightning Thief by Rick Riordan"
        />
      </Section>

      {/* Why I Read */}
      <Section
        title="Why I Love Reading"
        icon={Heart}
        color="pink"
        description="Share what makes reading special to you"
      >
        <Textarea
          value={profile.whyIRead}
          onChange={(e) => dispatch({ type: "UPDATE", field: "whyIRead", value: e.target.value })}
          placeholder="I read because every book is a new adventure..."
          rows={3}
        />
      </Section>

      {/* Favorite Genres */}
      <Section
        title="Favorite Genres"
        icon={Sparkles}
        color="purple"
        description="What types of books do you love?"
      >
        <ListEditor
          items={profile.favoriteGenres}
          onAdd={() => addToList("favoriteGenres")}
          onRemove={(i) => removeFromList("favoriteGenres", i)}
          newValue={newItem.favoriteGenres || ""}
          onNewValueChange={(v) =>
            setNewItem({ ...newItem, favoriteGenres: v })
          }
          placeholder="Add a genre..."
          color="purple"
        />
      </Section>

      {/* Favorite Authors */}
      <Section
        title="Favorite Authors"
        icon={User}
        color="amber"
        description="Authors whose books you love"
      >
        <ListEditor
          items={profile.favoriteAuthors}
          onAdd={() => addToList("favoriteAuthors")}
          onRemove={(i) => removeFromList("favoriteAuthors", i)}
          newValue={newItem.favoriteAuthors || ""}
          onNewValueChange={(v) =>
            setNewItem({ ...newItem, favoriteAuthors: v })
          }
          placeholder="Add an author..."
          color="amber"
        />
      </Section>

      {/* Fun Facts */}
      <Section
        title="Fun Facts About Me"
        icon={Sparkles}
        color="yellow"
        description="Share some fun reading facts about yourself"
      >
        <ListEditor
          items={profile.funFacts}
          onAdd={() => addToList("funFacts")}
          onRemove={(i) => removeFromList("funFacts", i)}
          newValue={newItem.funFacts || ""}
          onNewValueChange={(v) => setNewItem({ ...newItem, funFacts: v })}
          placeholder="Add a fun fact..."
          color="yellow"
        />
      </Section>

      {/* Reading Goals */}
      <Section
        title="Reading Goals"
        icon={Target}
        color="green"
        description="What are your reading goals?"
      >
        <ListEditor
          items={profile.readingGoals}
          onAdd={() => addToList("readingGoals")}
          onRemove={(i) => removeFromList("readingGoals", i)}
          newValue={newItem.readingGoals || ""}
          onNewValueChange={(v) => setNewItem({ ...newItem, readingGoals: v })}
          placeholder="Add a goal..."
          color="green"
        />
      </Section>

      {/* Achievements */}
      <Section
        title="Reading Achievements"
        icon={Award}
        color="indigo"
        description="Celebrate your reading accomplishments"
      >
        <ListEditor
          items={profile.achievements}
          onAdd={() => addToList("achievements")}
          onRemove={(i) => removeFromList("achievements", i)}
          newValue={newItem.achievements || ""}
          onNewValueChange={(v) => setNewItem({ ...newItem, achievements: v })}
          placeholder="Add an achievement..."
          color="indigo"
        />
      </Section>

      {/* Save Button (bottom) */}
      <div className="flex justify-end pb-8">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          disabled={saving}
          icon={saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        >
          {saved ? "Saved!" : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
};

// Section Component
interface SectionProps {
  title: string;
  icon: React.ElementType;
  color: string;
  description: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  icon: Icon,
  color,
  description,
  children,
}) => {
  const colorClasses: Record<string, string> = {
    purple: "from-purple-500 to-violet-500",
    blue: "from-blue-500 to-cyan-500",
    pink: "from-pink-500 to-rose-500",
    green: "from-green-500 to-emerald-500",
    amber: "from-amber-500 to-orange-500",
    yellow: "from-yellow-500 to-amber-500",
    indigo: "from-indigo-500 to-purple-500",
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
      <div className="p-5 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900">{title}</h3>
            <p className="text-sm text-stone-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

// List Editor Component
interface ListEditorProps {
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  newValue: string;
  onNewValueChange: (value: string) => void;
  placeholder: string;
  color: string;
}

const ListEditor: React.FC<ListEditorProps> = ({
  items,
  onAdd,
  onRemove,
  newValue,
  onNewValueChange,
  placeholder,
  color,
}) => {
  const bgClasses: Record<string, string> = {
    purple: "bg-purple-100 text-purple-700",
    amber: "bg-amber-100 text-amber-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };

  return (
    <div className="space-y-3">
      {/* Existing items */}
      <AnimatePresence>
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${bgClasses[color]}`}
              >
                {item}
                <button
                  onClick={() => onRemove(index)}
                  className="hover:bg-black/10 rounded-full p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Add new item */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={newValue}
          onChange={(e) => onNewValueChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
          placeholder={placeholder}
          size="sm"
          className="flex-1"
        />
        <IconButton
          icon={<Plus className="w-5 h-5" />}
          onClick={onAdd}
          disabled={!newValue.trim()}
          aria-label="Add item"
          variant="secondary"
          size="sm"
        />
      </div>
    </div>
  );
};

export default ProfileEditor;
