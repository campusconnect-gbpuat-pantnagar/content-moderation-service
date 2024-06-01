// const postSchema = new mongoose.Schema(
//   {
//     objType: {
//       type: String,
//       default: 'post',
//     },
//     userId: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User', // this need to be deleted if it creates a problem
//       required: true,
//     },
//     content: {
//       type: String,
//       max: 3000,
//       required: true,
//     },
//     is_safe: {
//       type: Boolean,
//       default: true,
//     },
//     media: [
//       {
//         url: {
//           type: String,
//           default: null,
//         },
//         format: {
//           type: String,
//           default: null,
//         },
//         publicId: {
//           type: String,
//           default: null,
//         },
//         resource_type: {
//           type: String,
//           default: null,
//         },
//         thumbnail_url: {
//           type: String,
//           default: null,
//         },
//         asset_id: {
//           type: String,
//           default: null,
//         },
//       },
//     ],
//     likes: [
//       {
//         _id: false,
//         userId: {
//           type: mongoose.Schema.ObjectId,
//           ref: 'User',
//           required: true,
//         },
//       },
//     ],
//     comments: [
//       {
//         _id: false,
//         userId: {
//           type: mongoose.Schema.ObjectId,
//           ref: 'User', // this need to be deleted if it creates a problem
//           required: true,
//         },
//         text: {
//           type: String,
//           required: true,
//         },
//       },
//     ],
//   },
//   { timestamps: true },
// );

// postSchema.plugin(toJSON);
// module.exports = mongoose.model('Post', postSchema);
