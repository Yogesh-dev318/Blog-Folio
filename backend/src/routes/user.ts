import {Hono} from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify } from 'hono/jwt'
import {signinInput, signupInput} from "@yogesh20012004/medium-common"
export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>()


userRouter.post('/signup', async(c) => {
    const body = await c.req.json();
    const {success}=signupInput.safeParse(body);
    if(!success){
      c.status(403)
      return c.json({
        message:"Inputs are not correct"
      })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    try{
      const user=await prisma.user.create({
        data:{
          email:body.email,
          password:body.password,
          name:body.name
        }
      })
      if(!user){
        c.status(403)
        return c.text("Incorrect data")
      }
      const token=await sign({id:user.id},c.env.JWT_SECRET)
      return c.text(token)
    }
    catch(e){
      c.status(411)
      return c.text("user already exist")
    }
   
  })
  
  
  userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const {success}=signinInput.safeParse(body);
    if(!success){
      c.status(403)
      return c.json({
        message:"Inputs are not correct"
      })
    }
      const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL	,
      }).$extends(withAccelerate());
    try{
      
        const user = await prisma.user.findFirst({
          where: {
              email: body.email,
              password: body.password
          }
      });
  
      if (!user) {
          c.status(403);
          return c.json({ error: "user not found" });
      }
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.text(jwt)
    }
    catch(e){
      c.status(411)
      return c.text("user not found")
    }
  })