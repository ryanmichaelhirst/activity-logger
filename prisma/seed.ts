import { aniList } from "@/lib/anilist.server"
import { db } from "@/lib/db.server"
import { fakerEN_US as faker } from "@faker-js/faker"

async function seed() {
  const iterations = Array.from(Array(10).keys())

  const searchResp = await aniList.search("Gundam")
  const animes = searchResp.data.Page.media

  for (const iter of iterations) {
    const user = await db.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        googleId: faker.string.numeric(10),
        photoUrl: faker.image.avatar(),
      },
    })

    const anime = animes[iter]
    if (anime) {
      console.log("got anime", anime)

      await db.activity.create({
        data: {
          type: "anime",
          name: anime.title.userPreferred,
          photoUrl: anime.coverImage?.medium,
          objectId: anime.id.toString(),
          user: {
            connect: { id: user.id },
          },
        },
      })
    }
  }
}

seed()
  .then(async () => {
    console.log("🚀 Seed completed successfully")
  })
  .catch((e) => {
    console.error(e)
    console.log("❌ Seed failed")
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
