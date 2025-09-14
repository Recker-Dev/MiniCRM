import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "select_account",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ profile }) {
            // console.log("Profile received from Google:", profile);
            if (!profile?.email) return false;

            try {
                const response = await fetch("http://localhost:3000/api/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        gId: profile.sub,
                        name: profile.name,
                        email: profile.email,
                        avatar: profile.picture,
                    }),
                });

                // const responseData = await response.json();
                // console.log("Backend response data:", responseData);
            } catch (err) {
                console.error("Failed syncing with backend:", err);
                return false;
            }

            return true;
        },

        async jwt({ token, profile }) {
            if (profile) {
                token.googleId = profile.sub;
                token.email = profile.email;
                token.name = profile.name;
                token.avatar = profile.picture;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.googleId = token.googleId;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.avatar = token.avatar;
            }
            return session;
        },
    },
};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
