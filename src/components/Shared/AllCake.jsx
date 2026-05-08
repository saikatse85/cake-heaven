"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AllCakeSkeleton } from "./AllCakeSkeleton";
import ViewDetailsButton from "./ViewDetailsButton";
import { useCart } from "@/context/CartContext";
import AddToCartButton from "./AddToCartButton";
import CakeSearch from "./CakeSearch";

export function AllCakes() {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [flavour, setFlavour] = useState("");
  const [size, setSize] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch("/api/cakes")
      .then((res) => res.json())
      .then((data) => {
        setCakes(data);
        setLoading(false);
      });
  }, []);

  const filteredCakes = useMemo(() => {
    const query = search.toLowerCase().trim();

    return cakes.filter((cake) => {
      if (!query) return true;

      const nameMatch = cake?.name?.toLowerCase().includes(query);
      const categoryMatch = cake?.category?.toLowerCase().includes(query);
      const flavourMatch = cake?.flavour?.toLowerCase().includes(query);
      const sizeMatch = cake?.size?.toLowerCase().includes(query);

      // price search
      const priceMatch =
        cake?.price !== undefined &&
        (String(cake.price).includes(query) ||
          Number(cake.price) === Number(query));

      return (
        nameMatch || categoryMatch || flavourMatch || sizeMatch || priceMatch
      );
    });
  }, [cakes, search]);

  const totalPages = Math.ceil(filteredCakes.length / itemsPerPage);

  const paginatedCakes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCakes.slice(start, start + itemsPerPage);
  }, [filteredCakes, currentPage]);

  if (loading) {
    return <AllCakeSkeleton />;
  }

  return (
    <section className="py-16 px-6 bg-white dark:bg-zinc-950 text-black dark:text-white">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center mb-6"
      >
        All Featured Desert
      </motion.h2>

      {/* Search Component */}
      <CakeSearch
        search={search}
        setSearch={setSearch}
        setCurrentPage={setCurrentPage}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {paginatedCakes.map((cake) => (
          <motion.div
            key={cake._id}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="group hover:shadow-xl transition rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border dark:border-zinc-800">
                <div className="overflow-hidden">
                  <motion.img
                    src={cake?.image || "/cake-placeholder.jpg"}
                    alt={cake?.name}
                    className="h-48 w-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{cake?.name}</h3>

                  <p className="text-gray-500 dark:text-gray-300 text-sm line-clamp-2">
                    {cake?.description}
                  </p>

                  <p className="text-pink-500 font-bold">
                    $ {cake?.price} Only
                  </p>

                  <AddToCartButton addToCart={addToCart} cake={cake} />

                  <Link href={`/cakes/${cake._id}`}>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <ViewDetailsButton>View Details</ViewDetailsButton>
                    </motion.div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 rounded-lg bg-white/20 dark:bg-zinc-800/40 backdrop-blur-md border disabled:opacity-40"
        >
          Prev
        </motion.button>

        {[...Array(totalPages).keys()].map((num) => (
          <motion.button
            key={num}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentPage(num + 1)}
            className={`px-4 py-2 rounded-lg border backdrop-blur-md ${
              currentPage === num + 1
                ? "bg-pink-500 text-white"
                : "bg-white/20 dark:bg-zinc-800/40"
            }`}
          >
            {num + 1}
          </motion.button>
        ))}

        <motion.button
          whileTap={{ scale: 0.9 }}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg bg-white/20 dark:bg-zinc-800/40 backdrop-blur-md border disabled:opacity-40"
        >
          Next
        </motion.button>
      </div>
    </section>
  );
}
