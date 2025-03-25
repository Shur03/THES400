import { hashSync } from "bcryptjs"

const users = [
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'User',
      email: 'user@mail.com',
      password: hashSync('12345678', 10),
      // password: 'password',
    },
    {
      id: '410544b2-4001-4271-9855-feyyy',
      name: 'Shur',
      email: 'shur@mail.com',
      password: hashSync('010203', 10),
      // password: 'password',
    },
  ]
  
  export { users }