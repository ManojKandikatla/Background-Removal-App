// import {Webhook} from 'svix'
// import userModel from '../models/userModel.js'

// // API controller function to manage clerk user with database
// // http://localhost:4000/api/user/webhooks
// const clerkWebhooks = async (req,res)=>{

//     try {

//         //create a svix instance with clerk webhook secret
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

//         await whook.verify(JSON.stringify(req.body),{
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp":req.headers["svix-timestamp"],
//             "svix-signature":req.headers["svix-signature"]
//         })

//         const {data,type}=req.body

//         switch (type) {
//             case "user.created":{

//                 const userData={
//                     clerkId: data.id,
//                     email:data.email_addresses[0].email_address,
//                     firstName: data.first_name,
//                     lastName: data.last_name,
//                     photo: data.image_url,
//                 }
//                 await  userData.Model.create(userData)
//                 res.json({})

//                 break;
//             }
//             case "user.updated":{

//                 const userData={
//                     email:data.email_addresses[0].email_address,
//                     firstName: data.first_name,
//                     lastName: data.last_name,
//                     photo: data.image_url,
//                 }

//                 await userModel.findByIdAndUpdate({clerkId:data.id},userData)
//                 res.json({})

//                 break;
//             }
//             case "user.deleted":{

//                 await userModel.findOneAndDelete({clerkId:data.id})
//                 res.json({})

//                 break;
//             }

//             default:
//                 break;
//         }

//     } catch (error) {
//         console.log(error.message);
//         res.json({success:false,message:error.message})

//     }
// }

// export {clerkWebhooks}

import { Webhook } from "svix";
import userModel from "../models/userModel.js";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };

        await userModel.create(userData);
        return res.json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };

        await userModel.findOneAndUpdate({ clerkId: data.id }, userData, {
          new: true,
          upsert: true,
        });

        return res.json({ success: true });
      }

      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        return res.json({ success: true });
      }

      default:
        return res.status(400).json({ message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { clerkWebhooks };
