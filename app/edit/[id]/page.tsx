'use client'
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react'

function Editpage({params}:{params : {id:string}}) {
    
    const [formdata, setformdata] = useState({ term: "", term2: "" });
    const [isloading, setisloading] = useState(false);
    const [error, seterror] = useState<string | null>(null);

    const router = useRouter();
    useEffect(() => {
        const fetchdata = async () => {
            try {
                const response = await fetch(`/api/interpertation/${params.id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data")
                }
                const data = await response.json(); 
                console.log(data);
                setformdata({
                  term: data.interpretation.term,
                  term2: data.interpretation.term2,
                });
            }
            catch (error) {
                seterror("Failed to load data");
            }
        }
        fetchdata();    
    }, [])
    
    const handleinputchange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setformdata((prevdata) => ({
        ...prevdata,
        [e.target.name]: e.target.value,
      }));
    };


   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setisloading(true);
     seterror(null); // Reset error before submitting

    
        try {
          const response = await fetch(`/api/interpertation/${params.id}`, {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(formdata),
          });
          if (!response.ok) {
            throw new Error("Failed to update interpretation");
          }
          router.push("/");
        } 
        catch (error: any) {
          console.log("Error details:", error.message);
          seterror("Something went wrong, please try again");
        } finally {
          setisloading(false);
        }
   };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Edit Interpretation</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3" action="">
        <input
          type="text"
          name="term"
          onChange={handleinputchange}
          value={formdata.term}
          placeholder="Term"
          className="py-1 px-4 border rounded-md"
        />
        <textarea
          name="term2"
          onChange={handleinputchange}
          value={formdata.term2}
          rows={4}
          placeholder="Interpretation"
          className="py-1 px-4 border rounded-md resize-none"
          id=""
        ></textarea>
        <button className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer">
          {isloading ? "Update..." : " Update Interpretation"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4 ">{error}</p>}
    </div>
  );
}

export default Editpage     