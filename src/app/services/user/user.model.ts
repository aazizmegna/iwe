export class User {
  public id?: any;
  public login?: string;
  public firstName?: string;
  public lastName?: string;
  public email?: string;
  public activated?: boolean;
  public langKey?: string;
  public authorities?: any[];
  public createdBy?: string;
  public createdDate?: Date;
  public lastModifiedBy?: string;
  public lastModifiedDate?: Date;
  public password?: string;
  public serviceProviderId?: number;
  public serviceConsumerId?: number;
  public contentContentType?: string;
  public location?: string;
  public content?: any;
  public imageUrl?: string;

  constructor(
    id?: any,
    login?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    activated?: boolean,
    langKey?: string,
    authorities?: any[],
    createdBy?: string,
    createdDate?: Date,
    lastModifiedBy?: string,
    lastModifiedDate?: Date,
    password?: string,
    serviceProviderId?: number,
    serviceConsumerId?: number,
    contentContentType?: string,
    location?: string,
    content?: any,
    imageUrl?: string
  ) {
    this.id = id ? id : null;
    this.login = login ? login : null;
    this.serviceProviderId = serviceProviderId ? serviceProviderId : null;
    this.serviceConsumerId = serviceConsumerId ? serviceConsumerId : null;
    this.firstName = firstName ? firstName : null;
    this.lastName = lastName ? lastName : null;
    this.email = email ? email : null;
    this.activated = activated ? activated : false;
    this.langKey = langKey ? langKey : null;
    this.authorities = authorities ? authorities : null;
    this.createdBy = createdBy ? createdBy : null;
    this.createdDate = createdDate ? createdDate : null;
    this.lastModifiedBy = lastModifiedBy ? lastModifiedBy : null;
    this.lastModifiedDate = lastModifiedDate ? lastModifiedDate : null;
    this.password = password ? password : null;
    this.content = content;
    this.contentContentType = contentContentType;
    this.location = location;
    this.imageUrl = imageUrl;
  }
}
