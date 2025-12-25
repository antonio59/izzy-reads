import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles, Palette, Shirt, Eye } from "lucide-react";

export interface AvatarConfig {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  accessory?: string;
  background: string;
  outfit: string;
  outfitColor: string;
}

const SKIN_TONES = [
  { id: "light", color: "#FFE0BD", name: "Light" },
  { id: "fair", color: "#FFCD94", name: "Fair" },
  { id: "medium", color: "#E5A073", name: "Medium" },
  { id: "olive", color: "#C68642", name: "Olive" },
  { id: "tan", color: "#8D5524", name: "Tan" },
  { id: "dark", color: "#5C3317", name: "Dark" },
];

const HAIR_STYLES = [
  {
    id: "long",
    name: "Long",
    path: "M50,25 Q30,30 25,50 Q20,80 30,100 L70,100 Q80,80 75,50 Q70,30 50,25",
  },
  {
    id: "short",
    name: "Short",
    path: "M50,25 Q35,28 30,40 Q28,55 35,60 L65,60 Q72,55 70,40 Q65,28 50,25",
  },
  {
    id: "curly",
    name: "Curly",
    path: "M50,22 Q25,25 22,50 Q20,70 25,85 Q30,95 35,100 L65,100 Q70,95 75,85 Q80,70 78,50 Q75,25 50,22 M30,35 Q25,40 28,45 M70,35 Q75,40 72,45 M28,55 Q22,60 26,68 M72,55 Q78,60 74,68",
  },
  {
    id: "ponytail",
    name: "Ponytail",
    path: "M50,25 Q35,28 32,45 L32,55 L68,55 L68,45 Q65,28 50,25 M68,45 Q85,50 88,70 Q90,90 80,100 Q75,95 78,70 Q75,55 68,50",
  },
  {
    id: "braids",
    name: "Braids",
    path: "M50,25 Q35,28 30,45 L30,60 Q28,80 25,100 L35,100 Q32,80 35,60 L35,45 L65,45 L65,60 Q68,80 65,100 L75,100 Q72,80 70,60 L70,45 Q65,28 50,25",
  },
  {
    id: "bun",
    name: "Bun",
    path: "M50,25 Q35,28 32,45 L32,55 L68,55 L68,45 Q65,28 50,25 M50,15 Q60,12 65,18 Q68,28 60,32 Q50,35 40,32 Q32,28 35,18 Q40,12 50,15",
  },
];

const HAIR_COLORS = [
  { id: "black", color: "#1a1a1a", name: "Black" },
  { id: "brown", color: "#4a3728", name: "Brown" },
  { id: "blonde", color: "#d4a853", name: "Blonde" },
  { id: "red", color: "#8b3a3a", name: "Red" },
  { id: "pink", color: "#ff69b4", name: "Pink" },
  { id: "purple", color: "#9370db", name: "Purple" },
  { id: "blue", color: "#4169e1", name: "Blue" },
];

const EYE_COLORS = [
  { id: "brown", color: "#634e34", name: "Brown" },
  { id: "blue", color: "#3d85c6", name: "Blue" },
  { id: "green", color: "#3d8b40", name: "Green" },
  { id: "hazel", color: "#8e7618", name: "Hazel" },
  { id: "gray", color: "#708090", name: "Gray" },
];

const ACCESSORIES = [
  { id: "none", name: "None", emoji: "" },
  { id: "glasses", name: "Glasses", emoji: "👓" },
  { id: "sunglasses", name: "Sunglasses", emoji: "🕶️" },
  { id: "bow", name: "Hair Bow", emoji: "🎀" },
  { id: "crown", name: "Crown", emoji: "👑" },
  { id: "headphones", name: "Headphones", emoji: "🎧" },
  { id: "flower", name: "Flower", emoji: "🌸" },
  { id: "star", name: "Star", emoji: "⭐" },
];

const BACKGROUNDS = [
  { id: "pink", gradient: "from-pink-300 to-purple-300", name: "Pink Dream" },
  { id: "blue", gradient: "from-blue-300 to-cyan-300", name: "Ocean" },
  { id: "green", gradient: "from-green-300 to-teal-300", name: "Forest" },
  { id: "orange", gradient: "from-orange-300 to-yellow-300", name: "Sunset" },
  { id: "purple", gradient: "from-purple-300 to-indigo-300", name: "Galaxy" },
  {
    id: "rainbow",
    gradient: "from-red-300 via-yellow-300 to-blue-300",
    name: "Rainbow",
  },
];

const OUTFITS = [
  { id: "tshirt", name: "T-Shirt" },
  { id: "hoodie", name: "Hoodie" },
  { id: "dress", name: "Dress" },
  { id: "sweater", name: "Sweater" },
];

const OUTFIT_COLORS = [
  { id: "red", color: "#ef4444", name: "Red" },
  { id: "blue", color: "#3b82f6", name: "Blue" },
  { id: "green", color: "#22c55e", name: "Green" },
  { id: "purple", color: "#a855f7", name: "Purple" },
  { id: "pink", color: "#ec4899", name: "Pink" },
  { id: "yellow", color: "#eab308", name: "Yellow" },
  { id: "orange", color: "#f97316", name: "Orange" },
  { id: "teal", color: "#14b8a6", name: "Teal" },
];

interface AvatarCreatorProps {
  initialConfig?: AvatarConfig;
  onSave: (config: AvatarConfig) => void;
  onClose: () => void;
}

const defaultConfig: AvatarConfig = {
  skinTone: "fair",
  hairStyle: "long",
  hairColor: "brown",
  eyeColor: "brown",
  accessory: "none",
  background: "pink",
  outfit: "tshirt",
  outfitColor: "purple",
};

// Avatar Preview Component
export function AvatarPreview({
  config,
  size = "lg",
}: {
  config: AvatarConfig;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  const skinTone =
    SKIN_TONES.find((s) => s.id === config.skinTone)?.color ||
    SKIN_TONES[1].color;
  const hairColor =
    HAIR_COLORS.find((h) => h.id === config.hairColor)?.color ||
    HAIR_COLORS[1].color;
  const eyeColor =
    EYE_COLORS.find((e) => e.id === config.eyeColor)?.color ||
    EYE_COLORS[0].color;
  const hairStyle =
    HAIR_STYLES.find((h) => h.id === config.hairStyle) || HAIR_STYLES[0];
  const background =
    BACKGROUNDS.find((b) => b.id === config.background) || BACKGROUNDS[0];
  const accessory = ACCESSORIES.find((a) => a.id === config.accessory);
  const outfitColor =
    OUTFIT_COLORS.find((o) => o.id === config.outfitColor)?.color ||
    OUTFIT_COLORS[3].color;

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br ${background.gradient} flex items-center justify-center relative`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Hair (back layer) */}
        <path d={hairStyle.path} fill={hairColor} />

        {/* Face */}
        <ellipse cx="50" cy="55" rx="25" ry="28" fill={skinTone} />

        {/* Outfit/Body */}
        <ellipse cx="50" cy="95" rx="30" ry="15" fill={outfitColor} />
        {config.outfit === "hoodie" && (
          <path
            d="M35,85 Q50,80 65,85 L68,100 L32,100 Z"
            fill={outfitColor}
            opacity="0.8"
          />
        )}
        {config.outfit === "dress" && (
          <path d="M35,88 L30,100 L70,100 L65,88" fill={outfitColor} />
        )}

        {/* Eyes */}
        <ellipse cx="42" cy="52" rx="5" ry="6" fill="white" />
        <ellipse cx="58" cy="52" rx="5" ry="6" fill="white" />
        <circle cx="42" cy="53" r="3" fill={eyeColor} />
        <circle cx="58" cy="53" r="3" fill={eyeColor} />
        <circle cx="43" cy="52" r="1" fill="white" />
        <circle cx="59" cy="52" r="1" fill="white" />

        {/* Eyebrows */}
        <path
          d="M37,46 Q42,44 47,46"
          stroke={hairColor}
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M53,46 Q58,44 63,46"
          stroke={hairColor}
          strokeWidth="1.5"
          fill="none"
        />

        {/* Nose */}
        <path
          d="M50,55 Q52,60 50,62"
          stroke={skinTone}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />

        {/* Smile */}
        <path
          d="M42,68 Q50,75 58,68"
          stroke="#d97706"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Blush */}
        <ellipse cx="35" cy="62" rx="5" ry="3" fill="#fca5a5" opacity="0.5" />
        <ellipse cx="65" cy="62" rx="5" ry="3" fill="#fca5a5" opacity="0.5" />

        {/* Glasses accessory */}
        {config.accessory === "glasses" && (
          <>
            <circle
              cx="42"
              cy="52"
              r="8"
              fill="none"
              stroke="#374151"
              strokeWidth="1.5"
            />
            <circle
              cx="58"
              cy="52"
              r="8"
              fill="none"
              stroke="#374151"
              strokeWidth="1.5"
            />
            <path d="M50,52 L50,52" stroke="#374151" strokeWidth="1.5" />
            <path d="M34,52 L28,50" stroke="#374151" strokeWidth="1.5" />
            <path d="M66,52 L72,50" stroke="#374151" strokeWidth="1.5" />
          </>
        )}

        {/* Sunglasses */}
        {config.accessory === "sunglasses" && (
          <>
            <ellipse cx="42" cy="52" rx="9" ry="7" fill="#1f2937" />
            <ellipse cx="58" cy="52" rx="9" ry="7" fill="#1f2937" />
            <path d="M51,52 L49,52" stroke="#1f2937" strokeWidth="2" />
            <path d="M33,50 L25,48" stroke="#1f2937" strokeWidth="2" />
            <path d="M67,50 L75,48" stroke="#1f2937" strokeWidth="2" />
          </>
        )}
      </svg>

      {/* Emoji accessories (rendered on top) */}
      {accessory &&
        accessory.id !== "none" &&
        accessory.id !== "glasses" &&
        accessory.id !== "sunglasses" && (
          <span
            className="absolute text-lg"
            style={{
              top:
                accessory.id === "crown" ||
                accessory.id === "bow" ||
                accessory.id === "flower" ||
                accessory.id === "star"
                  ? "5%"
                  : "25%",
              right: accessory.id === "headphones" ? "10%" : "15%",
            }}
          >
            {accessory.emoji}
          </span>
        )}
    </div>
  );
}

export default function AvatarCreator({
  initialConfig,
  onSave,
  onClose,
}: AvatarCreatorProps) {
  const [config, setConfig] = useState<AvatarConfig>(
    initialConfig || defaultConfig,
  );
  const [activeTab, setActiveTab] = useState<
    "skin" | "hair" | "eyes" | "accessories" | "outfit" | "background"
  >("skin");

  const updateConfig = (key: keyof AvatarConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: "skin", label: "Skin", icon: <Palette className="w-4 h-4" /> },
    { id: "hair", label: "Hair", icon: <Sparkles className="w-4 h-4" /> },
    { id: "eyes", label: "Eyes", icon: <Eye className="w-4 h-4" /> },
    {
      id: "accessories",
      label: "Extras",
      icon: <Sparkles className="w-4 h-4" />,
    },
    { id: "outfit", label: "Outfit", icon: <Shirt className="w-4 h-4" /> },
    {
      id: "background",
      label: "Background",
      icon: <Palette className="w-4 h-4" />,
    },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-stone-800">
                Create Your Avatar
              </h2>
              <p className="text-sm text-stone-500">
                Make it look just like you!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Preview */}
          <div className="flex-shrink-0 p-8 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center">
            <motion.div
              key={JSON.stringify(config)}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AvatarPreview config={config} size="xl" />
            </motion.div>
            <p className="mt-4 text-sm text-stone-500 font-medium">
              Your Avatar
            </p>
          </div>

          {/* Customization Options */}
          <div className="flex-1 p-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-violet-100 text-violet-700"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {activeTab === "skin" && (
                  <div>
                    <h3 className="text-sm font-semibold text-stone-700 mb-3">
                      Skin Tone
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {SKIN_TONES.map((tone) => (
                        <button
                          key={tone.id}
                          onClick={() => updateConfig("skinTone", tone.id)}
                          className={`w-12 h-12 rounded-full border-4 transition-all ${
                            config.skinTone === tone.id
                              ? "border-violet-500 scale-110"
                              : "border-transparent hover:scale-105"
                          }`}
                          style={{ backgroundColor: tone.color }}
                          title={tone.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "hair" && (
                  <>
                    <div>
                      <h3 className="text-sm font-semibold text-stone-700 mb-3">
                        Hair Style
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {HAIR_STYLES.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => updateConfig("hairStyle", style.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              config.hairStyle === style.id
                                ? "bg-violet-500 text-white"
                                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                            }`}
                          >
                            {style.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-stone-700 mb-3">
                        Hair Color
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {HAIR_COLORS.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => updateConfig("hairColor", color.id)}
                            className={`w-10 h-10 rounded-full border-4 transition-all ${
                              config.hairColor === color.id
                                ? "border-violet-500 scale-110"
                                : "border-transparent hover:scale-105"
                            }`}
                            style={{ backgroundColor: color.color }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "eyes" && (
                  <div>
                    <h3 className="text-sm font-semibold text-stone-700 mb-3">
                      Eye Color
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {EYE_COLORS.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => updateConfig("eyeColor", color.id)}
                          className={`w-10 h-10 rounded-full border-4 transition-all ${
                            config.eyeColor === color.id
                              ? "border-violet-500 scale-110"
                              : "border-transparent hover:scale-105"
                          }`}
                          style={{ backgroundColor: color.color }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "accessories" && (
                  <div>
                    <h3 className="text-sm font-semibold text-stone-700 mb-3">
                      Accessories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {ACCESSORIES.map((acc) => (
                        <button
                          key={acc.id}
                          onClick={() => updateConfig("accessory", acc.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            config.accessory === acc.id
                              ? "bg-violet-500 text-white"
                              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                          }`}
                        >
                          {acc.emoji && <span>{acc.emoji}</span>}
                          {acc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "outfit" && (
                  <>
                    <div>
                      <h3 className="text-sm font-semibold text-stone-700 mb-3">
                        Outfit Style
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {OUTFITS.map((outfit) => (
                          <button
                            key={outfit.id}
                            onClick={() => updateConfig("outfit", outfit.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              config.outfit === outfit.id
                                ? "bg-violet-500 text-white"
                                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                            }`}
                          >
                            {outfit.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-stone-700 mb-3">
                        Outfit Color
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {OUTFIT_COLORS.map((color) => (
                          <button
                            key={color.id}
                            onClick={() =>
                              updateConfig("outfitColor", color.id)
                            }
                            className={`w-10 h-10 rounded-full border-4 transition-all ${
                              config.outfitColor === color.id
                                ? "border-violet-500 scale-110"
                                : "border-transparent hover:scale-105"
                            }`}
                            style={{ backgroundColor: color.color }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "background" && (
                  <div>
                    <h3 className="text-sm font-semibold text-stone-700 mb-3">
                      Background
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {BACKGROUNDS.map((bg) => (
                        <button
                          key={bg.id}
                          onClick={() => updateConfig("background", bg.id)}
                          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${bg.gradient} border-4 transition-all ${
                            config.background === bg.id
                              ? "border-violet-500 scale-110"
                              : "border-transparent hover:scale-105"
                          }`}
                          title={bg.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-stone-100 bg-stone-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-stone-600 hover:bg-stone-200 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(config)}
            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-fuchsia-700 transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Avatar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
