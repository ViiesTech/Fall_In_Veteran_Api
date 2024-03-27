const User = require('../models/UserModal.js')
const PostModal = require('../models/PostModal.js')
const PageModal = require('../models/PageModal.js')

class PageController {
    static async CreatePage(req, res) {
        const { PageName, Mode } = req.body;
        const userData = req.user;
        let pageProfileImage = '';

        if (req.file && req.file.filename) {
            pageProfileImage = req.file.filename;
        }

        try {
            // Check if a page already exists for the user
            const existingPage = await PageModal.findOne({ OwnerPageId: userData._id });

            if (existingPage) {
                return res.status(200).json({
                    status: false,
                    message: "Page Already Created"
                });
            }

            // Create a new page
            const newPage = new PageModal({
                OwnerPageId: userData._id,
                Members: [],
                PageName: PageName,
                PageImage: pageProfileImage,
                Mode: Mode
            });

            await newPage.save();

            return res.status(200).json({
                status: true,
                message: "Page created successfully"
            });
        } catch (error) {
            console.error("Error creating page:", error);
            return res.status(500).json({
                status: false,
                message: "An error occurred while creating the page"
            });
        }
    }

    static async GetAllPages(req, res) {


        const getAllPages = await PageModal.find({})

        if (!getAllPages) {
            res.send({
                status: false,
                message: "No Page Found"
            })
        } else {
            res.send({
                status: true,
                message: "All pages",
                data: getAllPages
            })

        }
    }

    static async LikePage(req, res) {

        const { PageId } = req.body

        const userData = req.user

        const DoesIJoined = await PageModal.findById(PageId)

        const userExistInPage = DoesIJoined.Members.indexOf(userData._id)
        
        if(userExistInPage == -1){
            await PageModal.findByIdAndUpdate(PageId, { $push: { Members: userData._id } }).exec();
            await User.findByIdAndUpdate(userData._id, { $push: { PageIFollow: PageId } }).exec();
        }else{
            
            await PageModal.findByIdAndUpdate(PageId, { $pull: { Members: userData._id } }).exec();
            await User.findByIdAndUpdate(userData._id, { $pull: { PageIFollow: PageId } }).exec();
        }

        const updatedData = await User.findById(userData._id).exec()

        const PageUpdatedModal = await PageModal.findById(PageId).exec()

        res.send({
            "success": true,
            "message": "Like Page",
            "updated_data": updatedData,
            "data": PageUpdatedModal
        })




    }

    static async PageILiked(req, res){  
        
        const userData = req.user
        const AllPages = await PageModal.find({}).exec()

        
        if(AllPages.includes(userData._id)){

            res.send({
                status: true,
                message: AllPages,
            })

        }else{
                res.send({
                    status: false,
                    message: "Not Found",
                })
        }

        
    }

    static async GetPagePost(req, res) {
        const { PageId } = req.body;
    
        const getAllPostOfMyPage = await PostModal.find({ Page_id: PageId });

        const getPageData = await PageModal.findById(PageId);
    
        if (getAllPostOfMyPage) {
            res.send({
                status: true,
                message: "All posts",
                data: getAllPostOfMyPage,
                PageData: getPageData
            });
        } else {
            res.send({
                status: false,
                message: "No posts added yet"
            });
        }
    }

    
    



}




module.exports = PageController;