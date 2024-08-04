const Template = require('./template.db');

class TemplateService {
    async getTemplateByTitle(templateTitle) {
        const data = await Template.getTemplateByTitle(templateTitle);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async createTemplate(template) {
        // Check if the template object is valid
        if (template.templateTitle === undefined ||
            template.templateContent === undefined) {
            console.log("[TEMPLATE-Create] Invalid template object");
            return null;
        }

        const data = await Template.createTemplate(template);
        return data;
    }

    async updateTemplate(template) {
        // Check if the template object is valid
        if (template.templateTitle === undefined ||
            template.templateContent === undefined) {
            console.log("[TEMPLATE-Update] Invalid template object");
            return null;
        }

        const data = await Template.updateTemplate(template);
        console.log(data);
        return data;
    }

    async deleteTemplate(templateTitle) {
        // Check if the template title is valid
        if (templateTitle === undefined) {
            console.log("[TEMPLATE-Delete] Invalid template title");
            return null;
        }

        const data = await Template.deleteTemplate(templateTitle);
        return data;
    }
}

module.exports = new TemplateService();