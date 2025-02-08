import {z} from 'zod' 
export const userSignUpSchema = z.object({
    username: z
    .string()
    .min(3,'Username must be atleast 3 Characters')
    .max(20, 'Username should not be more than 20 Characters'),
    
    email: z
    .string().email({message: 'Invalid Email Address'}),

    password: z
    .string()
    .min(5,'Password must be atleast 5 characters')
})