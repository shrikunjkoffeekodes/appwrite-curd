import client from "@/lib/appwrite_client"
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";


const database = new Databases(client);

// create Interpretation

async function createInterpretation(data: {
  term: string;
  term2: string;
}) {
  try {
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Firstcollection",
      ID.unique(),
      data
    );

    return response;
  } catch (error) {
    console.error("Error creating i nterpretation", error);
    throw new Error("Failed to create interpretation");
  }
}


// fetch Interpretation

async function fetchInterpretation(){
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Firstcollection",
      [Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching interpretation", error);
    throw new Error("Failed to fetching interpretation");
  }
}


export async function POST(req: Request) {
    try {
        const { term, term2 } = await req.json();
        const data = { term, term2 };
        const response = await createInterpretation(data);  
        console.log(response);
        
        return NextResponse.json({ message: "Interpretation created" });
    } catch (error) {
        return NextResponse.json(
            {                 
                  error: " Failed to create interpretation",
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const terms = await fetchInterpretation();
        return NextResponse.json(terms);
    } catch (error) {
        return NextResponse.json(
             {error:"failed to fetch interpretation"},
            {status:500}
        )
    }
}