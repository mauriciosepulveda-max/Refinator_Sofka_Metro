#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════
# limpiar.sh — Deja tu repo en estado "listo para empezar"
#
# Uso desde ~/Documents/PM-refinador:
#    bash scripts/limpiar.sh
#
# Qué hace (en orden, todo automático):
#   1. Te lleva al directorio correcto (repo principal)
#   2. Borra cualquier worktree/rama de sesión anterior
#   3. Te deja parado en "main" (la rama oficial)
#   4. Baja los cambios más recientes de GitHub
#   5. Te dice si todo quedó bien
#
# Seguro de ejecutar siempre que quieras. No borra nada importante.
# ══════════════════════════════════════════════════════════════

set +e  # tolera fallos menores

REPO_ROOT="$HOME/Documents/PM-refinador"

# 1. Ir al repo principal
if [ ! -d "$REPO_ROOT/.git" ]; then
  echo "✗ No encuentro el repo en $REPO_ROOT"
  exit 1
fi
cd "$REPO_ROOT"

echo "🧹 Limpiando tu espacio de trabajo..."
echo ""

# 2. Si estamos dentro de un worktree, salir a main primero
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
if [ "$CURRENT_BRANCH" != "main" ]; then
  git checkout main 2>/dev/null
fi

# 3. Remover worktrees de sesiones anteriores (excepto el principal)
WT_COUNT=0
git worktree list --porcelain 2>/dev/null | awk '/^worktree /{path=$2; next} /^branch refs\/heads\/(claude|feature)/{print path}' | while read -r wt; do
  if [ -n "$wt" ] && [ "$wt" != "$REPO_ROOT" ]; then
    echo "  · Quitando worktree viejo: $(basename "$wt")"
    git worktree remove --force "$wt" 2>/dev/null
  fi
done
git worktree prune 2>/dev/null

# 4. Borrar ramas locales de sesiones (claude/* y feature/*)
DELETED=0
for branch in $(git branch | grep -E "^\s+(claude|feature)/" | tr -d ' '); do
  git branch -D "$branch" 2>/dev/null && DELETED=$((DELETED+1))
done
[ $DELETED -gt 0 ] && echo "  · $DELETED rama(s) de sesión borrada(s)"

# 5. Sincronizar con GitHub
echo "  · Bajando últimos cambios de GitHub..."
git fetch --prune 2>/dev/null >/dev/null
git pull --ff-only 2>/dev/null >/dev/null

# 6. Reporte final
echo ""
CURRENT=$(git branch --show-current)
BRANCHES=$(git branch | wc -l | tr -d ' ')
LAST_COMMIT=$(git log -1 --oneline 2>/dev/null)

if [ "$CURRENT" = "main" ] && [ "$BRANCHES" = "1" ]; then
  echo "✅ LISTO. Tu espacio está limpio."
  echo ""
  echo "   📍 Estás en: main"
  echo "   📝 Último cambio: $LAST_COMMIT"
  echo ""
  echo "   Ya puedes abrir Claude Code y empezar a trabajar tranquilo."
else
  echo "⚠ Casi listo, pero hay algo raro. Muestra esto si pides ayuda:"
  echo ""
  echo "   Rama actual: $CURRENT"
  echo "   Ramas totales: $BRANCHES"
  git branch
fi
