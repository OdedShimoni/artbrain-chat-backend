import express from 'express';
const router = express.Router();

router.get("/", (req: any, res: any ) => {
  res.send({ response: "I am alive" }).status(200);
});

export default router;