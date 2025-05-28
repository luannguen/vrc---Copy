# Product Categories Migration Guide

## Background

The VRC application initially used a generic `categories` collection for all types of categorization needs across the system. As the application grew, we needed more specialized category collections with specific fields and functionality for different content types.

This document explains the product categories migration process, which moves product categorization data from the generic `categories` collection to the dedicated `product-categories` collection.

## Migration Process

The migration process handles these key tasks:

1. **Extracting existing product categories**: All entries in the `categories` collection with `type: 'category'` are identified as product categories.

2. **Creating new specialized categories**: For each product category, a new entry is created in the `product-categories` collection with the following mapping:
   - `title` → `title`
   - `slug` → `slug` 
   - Empty description is added (generic categories didn't have descriptions)
   - Parent-child relationships are preserved where possible

3. **Updating product references**: All products that referenced categories in the old system are updated to point to the corresponding entries in the new `product-categories` collection.

4. **Reporting**: A report of the migration process is generated, showing how many categories were migrated and how many products were updated.

## Running the Migration

To run the migration:

1. Ensure your MongoDB database is running and accessible.
2. Navigate to the `maintain` folder in the VRC project.
3. Run the migration script using one of these methods:
   - Execute `run-migrate-product-categories.bat` (Windows batch file)
   - Run `powershell -ExecutionPolicy Bypass -File migrate-product-categories.ps1` (PowerShell)
   - Directly run `node migrate-product-categories.js` (Node.js)

The migration script will:
- Connect to your MongoDB database
- Find all product categories
- Create new entries in the `product-categories` collection
- Update all product references
- Report the results

## Post-Migration Steps

After the migration is complete:

1. **Verify the data**: Check the `product-categories` collection to ensure all categories were migrated correctly.
2. **Test product functionality**: Ensure products are displaying with the correct categories in the admin interface and on the frontend.
3. **Update any custom queries**: If your application has any custom queries that directly referenced the old category structure, update them to use the new `product-categories` collection.

## If Issues Occur

If you encounter any problems during the migration:

1. The script creates a backup of the affected data before making changes.
2. If errors occur, review the error messages in the console output.
3. You may need to restore from backup if the migration fails halfway through.
4. Contact the development team for assistance with any migration issues.

## Benefits of Specialized Categories

The new `product-categories` collection offers several advantages:

- **Dedicated fields**: Fields specific to product categorization like featured images, menu visibility, and ordering.
- **Better validation**: Category-specific validation rules for product organization.
- **Hierarchical structure**: Improved parent-child relationship handling with cycle prevention.
- **Enhanced filtering**: More accurate filtering in the admin UI and frontend.
- **Future extensibility**: Easier to add product-category-specific features in the future.

## Additional Resources

For more information about the product categorization system, refer to:

- [Product Management Guide](../docs/product-management-guide.md)
- [Backend API Structure](../docs/backend-api-structure.md)
