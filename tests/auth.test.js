const request = require("supertest");
const app = require("../src/app");

describe("Auth Routes", () => {
  // données de test réutilisables
  const validUser = {
    username: "testuser",
    email: "test@gmail.com",
    password: "password123",
  };

  // =====================
  // REGISTER
  // =====================
  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(validUser.email);
      expect(res.body.data.token).toBeDefined();
      // le password ne doit jamais apparaître dans la réponse
      expect(res.body.data.user.password).toBeUndefined();
    });

    it("should return 409 if email already exists", async () => {
      // premier register
      await request(app).post("/api/auth/register").send(validUser);
      // deuxième register avec le même email
      const res = await request(app).post("/api/auth/register").send(validUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it("should return 422 if username is missing", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "test@gmail.com", password: "password123" });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });

    it("should return 422 if email is invalid", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "testuser", email: "notemail", password: "password123" });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });

    it("should return 422 if password is too short", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "testuser", email: "test@gmail.com", password: "123" });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  // =====================
  // LOGIN
  // =====================
  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // crée un utilisateur avant chaque test de login
      await request(app).post("/api/auth/register").send(validUser);
    });

    it("should login successfully with valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: validUser.email, password: validUser.password });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it("should return 401 with wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: validUser.email, password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 401 with non-existent email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nobody@gmail.com", password: "password123" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // =====================
  // GET ME
  // =====================
  describe("GET /api/auth/me", () => {
    let token;

    beforeEach(async () => {
      // register puis login pour récupérer le token
      await request(app).post("/api/auth/register").send(validUser);
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: validUser.email, password: validUser.password });
      token = res.body.data.token;
    });

    it("should return current user with valid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(validUser.email);
    });

    it("should return 401 without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 401 with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer tokeninvalide");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});