import { PAGE_TYPE } from "../constants";
import { Input, Tile } from "../templates/components";
import {
  CREATE_PAGE_TEMPLATE,
  HOME_PAGE,
  MAIN_APP,
  READ_PAGE_TEMPLATE,
  UPDATE_PAGE_TEMPLATE,
} from "../templates/pages";
import { Field, MarkUp, Model } from "../types";

export class UIGenerator {
  models: Model[];

  constructor(models: Model[]) {
    this.models = models;
  }

  private getFieldsMarkUp(fields: Field[]) {
    let fieldsMarkup = "";
    fields.forEach((field) => {
      fieldsMarkup += this.getComponentMarkUp(field);
    });
    return fieldsMarkup;
  }

  private getComponentMarkUp(field: Field) {
    return Input.instance(field);
  }
  private getModelPagesMarkUp(model: Model): MarkUp[] {
    let modelPagesMarkup = [];
    if (model.operations.CREATE) {
      modelPagesMarkup.push({
        ...CREATE_PAGE_TEMPLATE(
          this.getFieldsMarkUp(model.fields),
          PAGE_TYPE.CREATE,
          model.name
        ),
        modelName: model.name,
      });
    }
    if (model.operations.UPDATE) {
      modelPagesMarkup.push({
        ...UPDATE_PAGE_TEMPLATE(
          this.getFieldsMarkUp(model.fields),
          PAGE_TYPE.CREATE,
          model.name
        ),
        modelName: model.name,
      });
    }
    if (model.operations.READ) {
      modelPagesMarkup.push({
        ...READ_PAGE_TEMPLATE(model.name),
        modelName: model.name,
      });
    }
    return modelPagesMarkup;
  }
  generateHomePage() {
    return HOME_PAGE();
  }
  getAllPagesMarkUp(): MarkUp[] {
    let allPagesMarkUp: MarkUp[] = [];
    this.models.forEach((model) => {
      allPagesMarkUp = [
        ...allPagesMarkUp,
        ...this.getModelPagesMarkUp(model),
        MAIN_APP(),
        this.generateHomePage(),
      ];
    });
    return allPagesMarkUp;
  }
}
