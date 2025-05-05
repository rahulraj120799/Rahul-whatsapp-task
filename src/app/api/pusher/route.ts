import { NextResponse } from 'next/server';
import Pusher from 'pusher';
import connectMongoDB from '@/server/libs/mongodb';

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
  secret: process.env.NEXT_PUBLIC_PUSHER_SECRET as string,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
  useTLS: true,
});

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    const { toUserId, fromUserId, _id } = await request.json();
    const result = await pusher.trigger('chat', 'message', {
      toUserId,
      fromUserId,
      _id,
    });

    return NextResponse.json({ data: result, message: 'Search successful' });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
