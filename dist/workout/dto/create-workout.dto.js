"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWorkoutDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const dates_entity_1 = require("../entities/dates.entity");
class CreateWorkoutDto extends (0, swagger_1.PickType)(dates_entity_1.Dates, ['date']) {
}
exports.CreateWorkoutDto = CreateWorkoutDto;
//# sourceMappingURL=create-workout.dto.js.map