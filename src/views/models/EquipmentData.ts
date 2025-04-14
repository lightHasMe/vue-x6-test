export class EquipmentData {
  public id: string
  public nameCn: string
  public nameTw: string
  public nameEn: string
  public recipeId: string
  public CIMMode: string

  constructor(id: string, nameCn: string) {
    this.id = id
    this.nameCn = nameCn
    this.nameTw = ''
    this.nameEn = ''
    this.recipeId = ''
    this.CIMMode = ''
  }
}
