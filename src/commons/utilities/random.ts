import ShortUniqueId from "short-unique-id";

export function random() {
  const base58chars =
    "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz".split("");
  const uuid = new ShortUniqueId({ length: 8, dictionary: base58chars });

  return uuid();
}

random();
