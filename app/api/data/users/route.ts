import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, addUserByEmail } from '@/app/lib/queries';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Donde esta email' }, { status: 400 });
  }
  const user = await getUserByEmail(email);
  if (user) {
    return NextResponse.json(user);
  } else {
    const newUser = await addUserByEmail(email);
    return NextResponse.json(newUser);
  }
}
