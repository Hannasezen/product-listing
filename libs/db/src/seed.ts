import { sql } from "drizzle-orm";
import { db } from "./client.js";
import { categories, products, users } from "./schema.js";

function openLibraryCover(isbn: string) {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

function unsplashPhoto(id: string) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
}

async function seed() {
  await db
    .insert(categories)
    .values([{ name: "Books" }, { name: "Toys" }])
    .onConflictDoNothing({ target: categories.name });

  const allCategories = await db.select().from(categories);
  const books = allCategories.find((category) => category.name === "Books");
  const toys = allCategories.find((category) => category.name === "Toys");
  if (!books) throw new Error('Seed error: "Books" category not found');
  if (!toys) throw new Error('Seed error: "Toys" category not found');

  await db
    .insert(products)
    .values([
      {
        name: "The Great Gatsby",
        slug: "the-great-gatsby",
        description: "A classic novel by F. Scott Fitzgerald.",
        price: "10.99",
        imageUrl: openLibraryCover("9780743273565"),
        categoryId: books.id,
      },
      {
        name: "To Kill a Mockingbird",
        slug: "to-kill-a-mockingbird",
        description: "A novel by Harper Lee.",
        price: "12.99",
        imageUrl: openLibraryCover("9780061120084"),
        categoryId: books.id,
      },
      {
        name: "1984",
        slug: "1984",
        description: "A dystopian novel by George Orwell.",
        price: "9.99",
        imageUrl: openLibraryCover("9780451524935"),
        categoryId: books.id,
      },
      {
        name: "The Catcher in the Rye",
        slug: "the-catcher-in-the-rye",
        description: "A novel by J.D. Salinger.",
        price: "11.99",
        imageUrl: openLibraryCover("9780316769488"),
        categoryId: books.id,
      },
      {
        name: "Pride and Prejudice",
        slug: "pride-and-prejudice",
        description: "A classic novel by Jane Austen.",
        price: "8.99",
        imageUrl: openLibraryCover("9780141439518"),
        categoryId: books.id,
      },
      {
        name: "Wooden Building Blocks Set",
        slug: "wooden-building-blocks-set",
        description: "A 100-piece set of colorful wooden building blocks.",
        price: "24.99",
        imageUrl: unsplashPhoto("1638802538115-041e14d28d6a"),
        categoryId: toys.id,
      },
      {
        name: "Remote Control Car",
        slug: "remote-control-car",
        description: "A fast, rechargeable remote control racing car.",
        price: "34.99",
        imageUrl: unsplashPhoto("1527612820672-5b56351f7346"),
        categoryId: toys.id,
      },
      {
        name: "Plush Teddy Bear",
        slug: "plush-teddy-bear",
        description: "A soft, huggable teddy bear for all ages.",
        price: "18.99",
        imageUrl: unsplashPhoto("1583478415880-b79447d73a84"),
        categoryId: toys.id,
      },
      {
        name: "Wooden Jigsaw Puzzle",
        slug: "wooden-jigsaw-puzzle",
        description: "A 200-piece wooden jigsaw puzzle for family game night.",
        price: "15.99",
        imageUrl: unsplashPhoto("1704027689040-26184f878a78"),
        categoryId: toys.id,
      },
      {
        name: "Toy Robot",
        slug: "toy-robot",
        description: "A walking, talking toy robot with light-up eyes.",
        price: "29.99",
        imageUrl: unsplashPhoto("1546776230-bb86256870ce"),
        categoryId: toys.id,
      },
      {
        name: "Paw Patrol Action Figures",
        slug: "paw-patrol-action-figures",
        description: "A set of 6 action figures from the popular Paw Patrol series.",
        price: "39.99",
        imageUrl: unsplashPhoto("1658233427329-9d72b824e144"),
        categoryId: toys.id,
      }
    ])
    .onConflictDoUpdate({
      target: products.slug,
      set: { imageUrl: sql`excluded."imageUrl"` },
    });

  await db
    .insert(users)
    .values([
      {
        name: "Admin",
        email: "hanna.sezen.ua@gmail.com",
      },
    ])
    .onConflictDoNothing({ target: users.email });

  console.log("Seed complete");
}

seed()
  .catch((error) => {
    console.error("Error seeding the database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
