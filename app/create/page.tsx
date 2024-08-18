'use client'
import { useRouter } from 'next/navigation';
import { report } from 'process';
import React, { ChangeEvent, useState } from 'react'

function CreatePage() {

    const [formdata, setformdata] = useState({ term: "", term2: "" });
    const [isloading, setisloading] = useState(false);
    const [error, seterror] = useState<string | null>(null);

    const router = useRouter();

    const handleinputChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setformdata((prevdata) => ({
            ...prevdata,
            [e.target.name]: e.target.value,
        }));
    }


    const handlesubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formdata.term || !formdata.term2) {
          seterror("please fill in all the fields");
          return;
        }
        seterror(null);
        setisloading(true);
        try {
            const response = await fetch("/api/interpertation", {
                method: "POST",
                headers: {
                    "Content-type":"application/json",
                },
                body:JSON.stringify(formdata),      
            });
            if (!response.ok) {
                throw new Error("Failed to create interpretation");
            }  
            router.push("/");
        }   
        catch (error) {
            console.log(error);
            seterror("Something went Wrong. please try again")
        } finally {
            setisloading(false);
        }
    }
  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Add New Interpretation</h2>
      <form onSubmit={handlesubmit} className="flex flex-col gap-3" action="">
        <input
          type="text"
          value={formdata.term}
          onChange={handleinputChange}
          name="term"
          placeholder="Term"
          className="py-1 px-4 border rounded-md"
        />
        <textarea
          name="term2"
          onChange={handleinputChange}
          value={formdata.term2}
          rows={4}
          placeholder="Interpretation"
          className="py-1 px-4 border rounded-md resize-none"
          id=""
        ></textarea>
        <button
          type="submit"
          disabled={isloading}
          className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer"
        >
          {" "}
          {isloading ? "Adding..." : " Add Interpretation"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4 ">{error}</p>}
    </div>
  );
}

export default CreatePage;