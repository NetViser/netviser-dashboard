"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { columns } from "@/utils/inputConstraints";

export default function InputFileConstraints() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Button className="inline-flex items-center px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md transition-all backdrop-blur-sm">
            View Input File Constraints
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto overflow-x-hidden border-0 bg-white/80 backdrop-blur-2xl shadow-2xl shadow-orange-500/10 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Input File Constraints
          </DialogTitle>
          <DialogDescription className="text-stone-700 mt-2 font-medium">
            Specifications for Input Network Traffic Data File
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-white/90 backdrop-blur-sm border border-orange-200/30 shadow-inner"
          >
            <h3 className="text-xl font-semibold text-stone-900 mb-4 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
              File Requirements
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                "Format: CSV (.csv)",
                "Max Size: 1GB",
                "Encoding: UTF-8 Recommended",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center text-stone-700 before:content-['▹'] before:text-orange-500 before:mr-2 before:font-bold"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <div className="relative pb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative rounded-xl bg-white/90 backdrop-blur-sm border border-orange-200/30 shadow-inner"
            >
              <div className="overflow-x-hidden overflow-y-auto rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-orange-600/80 border-b border-orange-200/30">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-orange-50">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-orange-50">
                        Column Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-orange-50">
                        Data Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100/30">
                    {columns.map((column, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-orange-50/40 transition-colors"
                      >
                        <td className="px-6 py-3 text-sm text-stone-700 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3 text-sm text-stone-800">
                          {column.name}
                        </td>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100/80 text-orange-700 text-xs font-medium border border-orange-300/50">
                            {column.type}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}