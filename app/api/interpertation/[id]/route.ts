import client from "@/lib/appwrite_client";
import { Databases, ID } from "appwrite";
import { NextResponse } from "next/server";


const database = new Databases(client);

// fetch a specific data

async function fetchInterpretation(id: string) {
    try {   
        const interpretation = await database.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
          "Firstcollection",
          id
        );
        return interpretation;
    } catch (error) {
        console.error("Error fetching interpretation", error);
        throw new Error("failed to fetch interpretation");
    }   
}

// Delete a specific interpretation

async function deleteInterpretation(id: string) {
    try {
        const response = await database.deleteDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
          "Firstcollection",
          id
        );

        return response;
    } catch (error) {
          console.error("Error delete interpretation", error);
          throw new Error("failed to delete interpretation");
    }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await deleteInterpretation(id);
    return NextResponse.json({ message: "data deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete interpretation" },
      { status: 500 }
    );
  }
}  



export async function GET(
    req: Request,
    { params }: { params: { id: string } }
    
) {
    try {
        const id = params.id;
         console.log(params.id);
        const interpretation = await fetchInterpretation(id);
        return NextResponse.json({ interpretation });
    } catch(error){
        return NextResponse.json(
            { error: "Failed to fetch data" },
            { status: 500 }
        );
        
    }
   
}


 //update data

async function updateInterpretation(id: string, data: { term: string;  term2:string}) {
  try {
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Firstcollection",
      id,
      data
    );

    return response;
  } catch (error) {
    console.error("Error delete interpretation", error);
    throw new Error("failed to delete interpretation");
  }
}




export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
      const interpretation = await req.json();
      await updateInterpretation(id, interpretation);
    return NextResponse.json({ message:"Interpretaion updated" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update     data" },
      { status: 500 }
    );
  }
}
