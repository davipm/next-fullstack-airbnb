import { NextResponse as res } from "next/server";

import prisma from "@/utils/connect";
import getCurrentUser from "@/actions/getCurrentUser";

interface IParams {
  params: {
    listingId?: string;
  };
}

export async function POST(req: Request, { params }: IParams) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return res.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds.push(listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  });

  return res.json(user, { status: 200 });
}

export async function DELETE(req: Request, { params }: IParams) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return res.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  });

  return res.json(user, { status: 200 });
}