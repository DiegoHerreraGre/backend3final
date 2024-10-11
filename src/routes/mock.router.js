import { Router } from "express";
import { generateUsersMock } from "../mocks/user.mock.js";
import { UserServices } from "../services/user.services.js";
import { generatePetsMock } from "../mocks/pets.mock.js";
import { PetServices } from "../services/pet.services.js";

const userServices = new UserServices();
const petsServices = new PetServices();
const router = Router();

router.get("/mockingpets", async (req, res) => {
  const pets = generatePetsMock(100);
  const response = await petsServices.createMany(pets);
  res.status(201).json({ status: "ok", payload: response });
});

router.get("/mockingusers", async (req, res) => {
  const users = await generateUsersMock(50);
  const response = await userServices.createMany(users);

  res.status(201).json({ status: "ok", payload: response });
});

router.get("/generateData/:cu/:cp", async (req, res) => {
  try {
    console.log("Iniciando generateData");
    const { cu, cp } = req.params;
    console.log(`Generando ${cu} usuarios y ${cp} mascotas`);
    const users = await generateUsersMock(Number(cu));
    const pets = generatePetsMock(Number(cp));
    console.log("Usuarios y mascotas generados");
    const usersResponse = await userServices.createMany(users);
    const petsResponse = await petsServices.createMany(pets);
    console.log("Usuarios y mascotas guardados en la base de datos");

    res
      .status(201)
      .json({ status: "ok", payload: { usersResponse, petsResponse } });
  } catch (error) {
    console.error("Error en generateData:", error);
    res
      .status(500)
      .json({ status: "error", error: "Error interno del servidor" });
  }
});

export default router;
