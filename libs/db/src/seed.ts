import { db } from "./client.js";
import { categories, products, users } from "./schema.js";

async function seed() {
  await db
    .insert(categories)
    .values([{ name: "Books" }, { name: "Toys" }])
    .onConflictDoNothing({ target: categories.name });

  const allCategories = await db.select().from(categories);
  const books = allCategories.find((category) => category.name === "Books");
  if (!books) throw new Error('Seed error: "Books" category not found');

  await db
    .insert(products)
    .values([
      {
        name: "The Great Gatsby",
        slug: "the-great-gatsby",
        description: "A classic novel by F. Scott Fitzgerald.",
        price: "10.99",
        categoryId: books.id,
      },
      {
        name: "To Kill a Mockingbird",
        slug: "to-kill-a-mockingbird",
        description: "A novel by Harper Lee.",
        price: "12.99",
        categoryId: books.id,
      },
      {
        name: "1984",
        slug: "1984",
        description: "A dystopian novel by George Orwell.",
        price: "9.99",
        categoryId: books.id,
      },
      {
        name: "The Catcher in the Rye",
        slug: "the-catcher-in-the-rye",
        description: "A novel by J.D. Salinger.",
        price: "11.99",
        categoryId: books.id,
      },
      {
        name: "Pride and Prejudice",
        slug: "pride-and-prejudice",
        description: "A classic novel by Jane Austen.",
        price: "8.99",
        categoryId: books.id,
      },
    ])
    .onConflictDoNothing({ target: products.slug });

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
