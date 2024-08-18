'use client'
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Iterm {
  $id: string;
  term: string;
  term2: string;
}
export default function Home() {  
  const [term, setterm] = useState<Iterm[]>([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterpretation = async () => {
      setloading(true);
      try {
        const response = await fetch("/api/interpertation");
        if (!response.ok) {
          throw new Error("Failed to fetch interpretation ");
        }
        const data = await response.json();
        setterm(data);
      } catch (error) {
        console.log("Error: ", error);
        seterror("Failed to load data. please try reload the page.");
      } finally {
        setloading(false);
      }
    };
    fetchInterpretation();
  }, [])
  

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/interpertation/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update the client-side state only if the deletion was successful on the server
        setterm((preval) => preval?.filter((i) => i.$id !== id));
      } else {
        throw new Error("Failed to delete data on the server.");
      }
    } catch (error) {
      seterror("Failed to delete data. Please try again.");
    }
  };


  // const handleDelete = async (id: string) => {
  //   try {
  //     await fetch(`/api/interpertation${id}`, { method: "DELETE" });
  //     setterm((preval) =>
  //       preval?.filter((i) => i.$id!== id)
  //     );
  //   } catch (error) {
  //     seterror("failed to delete data. plese try again.");
  //   }
  // }
  
  
  return (
    <div className="">
      {error && <p className="py-4 text-red-500"> {error} </p>}
      {loading ? (
        <p>Loading data....</p>
      ) : term?.length > 0 ? (
        <div className=" ">
          {term?.map((terms) => (
            <div
              key={terms.$id}
              className="p-4 my-2 rounded-md border-b leading-8 "
            >
              <div className="font-bold">{terms.term}</div>
              <div>
               {terms.term2}
              </div>
              <div className="flex gap-4 mt-4 justify-end">
                <Link
                  className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest "
                  href={`/edit/${terms.$id}`}
                >
                  Edit
                </Link>
                <button onClick={()=> handleDelete(terms.$id)} className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest ">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        ) : (
            <p>no data found.</p>
      ) }
    </div>
  );  
}
