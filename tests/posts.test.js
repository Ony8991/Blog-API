const request = require("supertest");
const app = require("../src/app");

describe("Post Routes", () => {
  const validUser = {
    username: "testuser",
    email: "test@gmail.com",
    password: "password123",
  };

  const validPost = {
    title: "Mon article de test",
    content: "Ceci est le contenu de mon article de test pour Jest.",
    category: "technology",
    tags: ["nodejs", "mongodb"],
    isPublished: true,
  };

  // helper — crée un user et retourne son token
  const getToken = async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: validUser.password });
    return res.body.data.token;
  };

  // helper — crée un post et retourne les données
  const createPost = async (token) => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send(validPost);
    return res.body.data;
  };

  // =====================
  // CREATE POST
  // =====================
  describe("POST /api/posts", () => {
    it("should create a post successfully", async () => {
      const token = await getToken();
      const res = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(validPost);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(validPost.title);
      expect(res.body.data.slug).toBe("mon-article-de-test");
    });

    it("should return 401 without token", async () => {
      const res = await request(app).post("/api/posts").send(validPost);
      expect(res.status).toBe(401);
    });

    it("should return 422 if title is missing", async () => {
      const token = await getToken();
      const res = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "Contenu sans titre", category: "technology" });

      expect(res.status).toBe(422);
    });
  });

  // =====================
  // GET ALL POSTS
  // =====================
  describe("GET /api/posts", () => {
    it("should return list of posts", async () => {
      const res = await request(app).get("/api/posts");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.posts)).toBe(true);
    });

    it("should support pagination", async () => {
      const res = await request(app).get("/api/posts?page=1&limit=5");

      expect(res.status).toBe(200);
      expect(res.body.data.page).toBe(1);
      expect(res.body.data.totalPages).toBeDefined();
    });
  });

  // =====================
  // GET POST BY SLUG
  // =====================
  describe("GET /api/posts/:slug", () => {
    it("should return a post by slug", async () => {
      const token = await getToken();
      const post = await createPost(token);

      const res = await request(app).get(`/api/posts/${post.slug}`);

      expect(res.status).toBe(200);
      expect(res.body.data.slug).toBe(post.slug);
    });

    it("should return 404 for non-existent slug", async () => {
      const res = await request(app).get("/api/posts/slug-inexistant");
      expect(res.status).toBe(404);
    });
  });

  // =====================
  // UPDATE POST
  // =====================
  describe("PUT /api/posts/:id", () => {
    it("should update a post successfully", async () => {
      const token = await getToken();
      const post = await createPost(token);

      const res = await request(app)
        .put(`/api/posts/${post._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Titre modifié",
          content: "Contenu modifié pour le test de mise à jour.",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Titre modifié");
    });

    it("should return 401 without token", async () => {
      const token = await getToken();
      const post = await createPost(token);

      const res = await request(app)
        .put(`/api/posts/${post._id}`)
        .send({ title: "Titre modifié" });

      expect(res.status).toBe(401);
    });
  });

  // =====================
  // DELETE POST
  // =====================
  describe("DELETE /api/posts/:id", () => {
    it("should delete a post successfully", async () => {
      const token = await getToken();
      const post = await createPost(token);

      const res = await request(app)
        .delete(`/api/posts/${post._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it("should return 401 without token", async () => {
      const token = await getToken();
      const post = await createPost(token);

      const res = await request(app).delete(`/api/posts/${post._id}`);

      expect(res.status).toBe(401);
    });
  });
});