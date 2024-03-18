
const PostModal = require('../models/PostModal.js')

class PostController {
    static CreatePost(req, res) {

        const { message, comunityStatus, CommunityId, CommunityImage, CommunityName } = req.body
        const userData = req.user;


        let postImage = ''; // Default empty string

        // Check if req.file exists and has a filename
        if (req.file && req.file.filename) {
            postImage = req.file.filename; // Set postImage if a file was uploaded
        }

        const Create_Post = new PostModal({
            userId: userData._id,
            name: userData.name,
            Post_Text: message,
            Post_Image: postImage,
            Post_Like: [],
            Post_Share: [],
            All_Comments_On_Post: [],
            Profile_Picture: userData.Profile_Picture,
            comunityStatus: comunityStatus,
            CommunityId: CommunityId,
            CommunityImage: CommunityImage,
            CommunityName: CommunityName

        })

        Create_Post.save().then(() => {
            res.send({
                "status": true,
                "Success": "Post created successfully",
                // "Post_Data": Create_Post
            })
        })
    }

    static async GetAllPost(req, res) {

        const { page } = req.body

        const perPage = 10

        try {
            const allPosts = await PostModal.find()
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec(); // Use lean() to get plain JavaScript objects instead of Mongoose documents

            const TotalPage = await PostModal.countDocuments()

            res.json({
                success: true,
                All_Post: allPosts,
                totalPages: Math.ceil(TotalPage / perPage),
                currentPage: page,
            });
        } catch (error) {
            console.error("Error fetching posts:", error);
            res.status(500).json({ success: false, error: "Server Error" });
        }
    }

    static async Like_On_Post(req, res) {
        try {
            const { postId, PostReaction } = req.body;


            const userData = req.user;

            const post = await PostModal.findById(postId);

            const userReactionIndnex = post.Post_Like.findIndex(reactions => reactions.myId.equals(userData._id))
            if (userReactionIndnex == -1) {
                post.Post_Like.push({ myId: userData._id, PostReaction: PostReaction, postId: postId }); // 
            } else {
                post.Post_Like[userReactionIndnex].PostReaction = PostReaction; // Assuming 
            }

            const updatedPost = await post.save();

            res.json({
                Success: true,
                Post_data: updatedPost
            });


        } catch (error) {
            res.status(500).json({ success: false, error: "Server Error" });
        }
    }

    static async Comment_On_Post(req, res) {
        try {
            const { Post_id, comment } = req.body;
            const userData = req.user;

            const post = await PostModal.findById(Post_id);

            if (comment == "") {

                return res.send({
                    "Success": false,
                    "messagae": "Please enter the comment"
                })
            }
            if (post) {

                const Comment = {
                    userId: userData._id,
                    Comment: comment,
                    Userpicture: userData.Profile_Picture,
                    Created_at: Date.now(),
                    Username: userData.name
                }

                const updatedPost = await PostModal.findByIdAndUpdate(
                    Post_id,
                    { $push: { All_Comments_On_Post: Comment } },
                    { new: true } // To return the updated document
                ).exec()

                if (!updatedPost) {
                    return res.status(404).json({ success: false, message: "Post not found" });
                }

                res.json({
                    Success: true,
                    Post_data: updatedPost
                });

            }


        } catch (error) {
            console.error("Error liking post:", error);
            res.status(500).json({ success: false, error: "Server Error" });
        }
    }

    static async Share_the_Post(req, res) {
        try {
            const { Post_id } = req.body;
            const userData = req.user;

            const post = await PostModal.findById(Post_id);


            if (post.Post_Share.includes(userData._id)) {


                res.json({
                    "Success": true,
                    "message": "post already Shared"
                });
            } else {
                const updatedPost = await PostModal.findByIdAndUpdate(
                    Post_id,
                    { $push: { Post_Share: userData._id } },
                    { new: true } // To return the updated document
                );

                if (!updatedPost) {
                    return res.status(404).json({ success: false, message: "Post not found" });
                }

                res.json({
                    "Success": true,
                    "Post_data": updatedPost
                });

            }




        } catch (error) {
            console.error("Error liking post:", error);
            res.status(500).json({ success: false, error: "Server Error" });
        }
    }


    static async getOnlyMyPost(req, res) {

        const userData = req.user

        const myPost = await PostModal.find({ $or: [{ userId: userData._id }, { Post_Share: { $in: [userData._id] } }] })



        res.send({
            "status": true,
            "data": myPost
        })
        console.log("first")
    }


    static async getFriendsPost(req, res) {
        const { FriendID } = req.body

        const AllFriendsPost = await PostModal.find({ userId: FriendID }).exec()

        res.send({
            status: true,
            message: "All post of the profile you visited",
            data: AllFriendsPost
        })
    }

}

module.exports = PostController;