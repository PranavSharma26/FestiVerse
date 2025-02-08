import {z} from 'zod' 
export const userSignUpSchema = z.object({
    clubname: z
    .string()
    .min(2,'Clubname must be atleast 2 Characters')
    .max(20, 'Clubname should not be more than 20 Characters'),
    
    email: z
    .string().email({message: 'Invalid Email Address'}),

    password: z
    .string()
    .min(5,'Password must be atleast 5 characters')
})