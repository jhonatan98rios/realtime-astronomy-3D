export function useMicrofonePermission(
  onSuccess: Function,
) {
  navigator.permissions
    .query({ name: "microphone" as PermissionName }) // usando casting
    .then(function (result) {
      if (result.state === "granted") {
        onSuccess();
      } else if (result.state === "prompt") {
        console.log(
          "Permissão de microfone pendente (usuário ainda não decidiu)."
        );
      } else if (result.state === "denied") {
        console.log("Permissão de microfone negada.");
      }

      // Listener para mudanças no estado de permissão
      result.onchange = function () {
        console.log(
          "O estado da permissão do microfone mudou para:",
          result.state
        );
      };
    })
    .catch(function (error) {
      console.error("Erro ao verificar a permissão do microfone:", error);
    });
}
