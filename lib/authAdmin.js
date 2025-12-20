import { clerkClient } from '@clerk/nextjs/server';

const authAdmin = async (userId) => {
    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId)

        if (user.publicMetadata?.role === 'admin') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log('[authAdmin] Error:', error.message)
        return false;
    }
}

export default authAdmin;