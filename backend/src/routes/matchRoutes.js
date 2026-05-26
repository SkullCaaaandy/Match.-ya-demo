const express = require("express");
const router = express.Router();

const matchingVacantesService = require("../services/matchingVacantesService"); //Algorimo Neyzer
//const matchingVacantesService = require("../../Services/matchingVacantesService");

// Obtener matches de un candidato, los trabajos recomendados para el candidato
router.get("/:id_candidato", async (req, res) => {
  try {
    const { id_candidato } = req.params;

    const resultado = await matchingVacantesService.procesar(id_candidato);

    res.json({
      ok: true,
      ...resultado
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener matches"
    });
  }
});

module.exports = router;