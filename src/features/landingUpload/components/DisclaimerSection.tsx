import { motion } from "framer-motion";
import { 
  supportedAttacks,
  visualizedAttacks,
} from "@/utils/disclaimer";

export default function DisclaimerSection() {
  return (
    <motion.div
      className="mt-10 bg-orange-50/80 border border-orange-200 rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-orange-800 mb-3">
        Disclaimer: Network Attack Analysis Capabilities
      </h3>
      <p className="text-sm text-stone-700 mb-2">
        NetViser can classify and provide explainable SHAP AI analysis for the following network attacks:
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        {supportedAttacks.map((attack) => (
          <span
            key={attack}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200"
          >
            {attack}
          </span>
        ))}
      </div>
      <p className="text-sm text-stone-700">
        Attack-specific characteristic visualizations are available for these types:
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {visualizedAttacks.map((attack) => (
          <span
            key={attack}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-200 text-orange-900 border border-orange-300"
          >
            {attack}
          </span>
        ))}
      </div>
    </motion.div>
  );
}