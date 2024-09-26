import { Stack, Text } from "@chakra-ui/react";

export default function ErrorMessage({ errorMsg }: { errorMsg: string }) {
  return (
    <Stack>
      {errorMsg && (
        <Text color="red.500" textAlign="center" padding={5}>
          {errorMsg}
        </Text>
      )}
    </Stack>
  );
}
