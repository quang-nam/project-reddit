"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const UserMutationResponse_1 = require("../types/UserMutationResponse");
const RegisterInput_1 = require("../types/RegisterInput");
const validateRegisterInput_1 = require("../utils/validateRegisterInput");
const LoginInput_1 = require("../types/LoginInput");
let UserResolver = class UserResolver {
    register(registerInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const validateRegisterInputError = (0, validateRegisterInput_1.validateRegisterInput)(registerInput);
            if (validateRegisterInputError !== null) {
                return Object.assign({ code: 400, success: false }, validateRegisterInputError);
            }
            try {
                const { username, email, password } = registerInput;
                const existingUser = yield User_1.User.findOne({
                    where: [{ username }, { email }]
                });
                if (existingUser)
                    return {
                        code: 400,
                        success: false,
                        message: 'Duplicate username or email',
                        error: [
                            { field: existingUser.username === username ? 'username' : 'email',
                                message: `${existingUser.username === username ?
                                    'Username' : 'Email'}already exist` }
                        ]
                    };
                const hashedPassword = yield argon2_1.default.hash(password);
                const newUser = User_1.User.create({
                    username,
                    password: hashedPassword,
                    email
                });
                return {
                    code: 200,
                    success: true,
                    message: 'User registration sucessful',
                    user: yield User_1.User.save(newUser)
                };
            }
            catch (err) {
                return {
                    code: 500,
                    success: false,
                    message: `Internal server error ${err.message}`
                };
            }
        });
    }
    login({ usernameOrEmail, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield User_1.User.findOne({
                    where: usernameOrEmail.includes('@')
                        ? { email: usernameOrEmail }
                        : { username: usernameOrEmail }
                });
                if (!existingUser)
                    return {
                        code: 400,
                        success: false,
                        message: "User not found",
                        error: [
                            { field: 'usernameOrEmail', message: 'Username or email not correct' }
                        ]
                    };
                const passwordValid = yield argon2_1.default.verify(existingUser.password, password);
                if (!passwordValid)
                    return {
                        code: 400,
                        success: false,
                        message: "Password not correct",
                        error: [
                            { field: 'password', message: "Incorrect password" }
                        ]
                    };
                return {
                    code: 200,
                    success: true,
                    message: 'User login successful',
                    user: existingUser
                };
            }
            catch (err) {
                return {
                    code: 500,
                    success: false,
                    message: `Internal server error ${err.message}`
                };
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(_returns => UserMutationResponse_1.UserMutationResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('registerInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput_1.RegisterInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)('loginInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput_1.LoginInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map