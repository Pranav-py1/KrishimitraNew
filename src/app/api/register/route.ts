import { NextResponse } from "next/server";
import { supabaseServer} from "@/app/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    const { data: existingUser, error: findError } = await supabaseServer
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabaseServer
      .from("users")
      .insert([{ name, email, password, role }]);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}