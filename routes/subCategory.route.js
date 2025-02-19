const router = require('express').Router()

const subCategoryController = require("../controller/subCategory.controller");
router.post('/',subCategoryController.Store)
router.get('/',subCategoryController.index)
router.get('/delete/:id',subCategoryController.delete)
router.post('/edit/:id',subCategoryController.edit)

module.exports = router 