import { Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useAuthStore } from '@/store/useAuthStore';
import LawyersItem from './LawyersItem';

const LawyerList = () => {
  const [search, setSearch] = useState("");
  const [lawyers, setLawyers] = useState([]);
  const [distance, setDistance] = useState(0);
  const { findLawyers, authUser } = useAuthStore();

  // fetch lawyers on mount and when search changes
  useEffect(() => {
    const fetchData = async () => {
      let dist = distance > 0 ? distance*1000 : 25000
      const data = {
        id: authUser._id,
        field: [],
        q: search,
        maxDistance: dist
      };

      if (authUser?.location?.coordinates) {
        data.longitude = authUser.location.coordinates[0]; // [lng, lat]
        data.latitude = authUser.location.coordinates[1];
      }

      try {
        const result = await findLawyers(data);
        setLawyers(result);
      } catch (err) {
        console.error("Error fetching lawyers:", err);
      }
    };
    fetchData();
  }, [search, findLawyers, authUser, distance]);

  return (
    <div className="w-full mt-20 space-y-10">
      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="flex items-center gap-4 py-3 px-4 rounded-lg bg-sidebar/40 md:w-[35%] xl:w-[40%] shadow-sm"
      >
        <Search className="size-5 text-muted-foreground" />
        <input
          type="text"
          className="outline-0 w-full bg-transparent text-sm"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          className="outline-0 w-50 bg-transparent text-sm"
          placeholder="Distance in KM..."
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
      </motion.div>
      

      {/* Lawyer List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8 relative"
      >
        {lawyers.length === 0 ? (
          <p className="text-sm text-gray-500 col-span-full">No lawyers found.</p>
        ) : (
          lawyers.map((lawyer, i) => (
            <motion.div
              key={lawyer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.02 }}
              className="w-full"
            >
              <LawyersItem lawyer={lawyer} />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default LawyerList;
